import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {loadPlanet} from "/@/space/planet";
import {map, shareReplay, tap} from "rxjs";
import {makeLineBetween} from "/@/utils";
import {makeAddRotationFunction, setupCommonControls} from "/@/space/util";
import {OnPlanetLoadedFn, Planet, PlanetControlsFolder} from "/@/space/types";
import * as THREE from "three";

const earthOptions = {
	addTilt: false,
	rotate: false,
}

const onEarthControlsLoaded: OnPlanetLoadedFn[] = [
	showAxes,
	addTiltToEarth,
	makeAddRotationFunction(earthOptions),
]

const axes = new THREE.Group()
axes.visible = false

export const earth$ = fromPromise(loadPlanet('earth')).pipe(
	tap((earth) => {
		if (earthOptions.addTilt) {
			earth.rotateZ(23.4 * Math.PI / 180)
		}
	}),
	shareReplay({refCount: true, bufferSize: 1}),
)

export const {earthControls$, earthPositionControl$} = (() => {
	const all$ = earth$.pipe(
		// take(1),
		map((earth) => {
			const earthControls = setupCommonControls('earth', earth);
			const earthPositionControl = {
				x: earthControls.addBinding(earth.position, 'x', {
					min: -1000,
					max: 1000,
					step: 1,
				}),
				y: earthControls.addBinding(earth.position, 'y', {
					min: -1000,
					max: 1000,
					step: 1,
				}),
				z: earthControls.addBinding(earth.position, 'z', {
					min: -1000,
					max: 1000,
					step: 1,
				}),
			}
			onEarthControlsLoaded.forEach(fn => fn(earth, earthControls))
			return {
				earthControls,
				earthPositionControl,
			}
		}),
		shareReplay({refCount: true, bufferSize: 1})
	)
	return {
		earthControls$: all$.pipe(map(v => v.earthControls)),
		earthPositionControl$: all$.pipe(map(v => v.earthPositionControl))
	}
})()

function addTiltToEarth(earth: Planet, controls: PlanetControlsFolder) {
	controls.addBinding(earthOptions, "addTilt", {
		label: "tilt"
	}).on('change', event => {
		if (event.value) {
			earth.rotateZ(23.4 * Math.PI / 180)
		} else {
			earth.rotateZ(-23.4 * Math.PI / 180)
		}
	})
}

function showAxes(_earth: Planet, controls: PlanetControlsFolder) {
	const earth = _earth.children[0]
	const referencePoint = earth.position.clone()
	referencePoint.set(referencePoint.x - 1000, referencePoint.y, referencePoint.z)
	// Line extending through coordinates (0,0) is created by rotating Y by -Math.PI / 2
	// (0,0), (0, 90), (0, -90), (0, 180)
	for (let i = 0; i < 4; i++) {
		let color = 0x00ff00
		if (i == 3) {
			color = 0xff0000
		}
		const line = makeLineBetween(earth.position, referencePoint, {color})
		line.rotateY(i * Math.PI / 2)
		axes.add(line)
	}
	// (90, 0) - North Pole
	const northPole = makeLineBetween(earth.position, referencePoint, {color: 0x00ff00})
	northPole.rotateX(Math.PI / 2)
	northPole.rotateY(-Math.PI / 2)
	axes.add(northPole)
	// (-90, 0) - South Pole
	const southPole = makeLineBetween(earth.position, referencePoint, {color: 0x00ff00})
	southPole.rotateX(Math.PI / 2)
	southPole.rotateY(Math.PI / 2)
	axes.add(southPole)
	earth.add(axes)

	controls.addBinding(axes, "visible", {
		label: "show axes"
	})
}