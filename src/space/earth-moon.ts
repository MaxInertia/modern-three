import {combineLatest, map, shareReplay} from "rxjs";
import {lookAt} from "/@/core/orbit-controls";
import {gui} from "/@/core/gui";
import {DISTANCE_SCALE, DISTANCE_TO_MOON} from "/@/space/planet";
import {moon$, moonPositionControl$} from "/@/space/moon";
import {earth$, earthPositionControl$} from "/@/space/earth";
import {makeLineBetween} from "/@/utils";
import {TpChangeEvent} from "@tweakpane/core";
import * as THREE from "three";

const showLineBetweenEarthAndMoonDefault = false

const earthMoonOptions: {
	centerCameraOn: "earth" | "moon"
	distanceToScale: boolean,
} = {
	centerCameraOn: "earth",
	distanceToScale: false,
}

export const lineBetweenEarthAndMoon$ = combineLatest([earth$, moon$]).pipe(
	map(([earth, moon]) => {
		const line = makeLineBetween(earth.position, moon.position)
		line.visible = showLineBetweenEarthAndMoonDefault
		gui.addBinding(line, "visible", {
			label: "Show line to moon"
		}).on('change', event => {
			line.visible = event.value
		})

		return line
	}),
	shareReplay({bufferSize: 1, refCount: true}),
)

combineLatest([earth$, moon$]).subscribe(([earth, moon]) => {
	let dx = DISTANCE_TO_MOON * DISTANCE_SCALE
	if (!earthMoonOptions.distanceToScale) {
		dx /= 20
	}
	moon.position.set(earth.position.x + dx, earth.position.y, earth.position.z)
	gui.refresh()
})

combineLatest([earth$, moon$]).subscribe(([earth, moon]) => {
	gui.addBinding(earthMoonOptions, "centerCameraOn", {
		label: "Center camera on",
		options: {
			earth: "earth",
			moon: "moon",
		}
	}).on('change', (event) => {
		if (event.value === "moon") {
			lookAt(moon.position)
		} else if (event.value === "earth") {
			lookAt(earth.position)
		} else {
			console.log(`unrecognized option for camera focus: \"${event.value}\"`)
		}
	})

	gui.addBinding(earthMoonOptions, "distanceToScale", {
		label: "Distance to scale"
	}).on('change', event => {
		const dx = DISTANCE_TO_MOON * DISTANCE_SCALE
		if (event.value) {
			// TODO: Make position updates for select THREE.Objects refresh the gui reactively
			moon.position.x = earth.position.x + dx
			gui.refresh()
		} else {
			moon.position.x = earth.position.x + (dx / 20)
			gui.refresh()
		}
	})
})

combineLatest([lineBetweenEarthAndMoon$, earthPositionControl$, moonPositionControl$]).subscribe(
	([line, earthPositionControl, moonPositionControl]) => {

		console.log("earthPositionControl", earthPositionControl)
		console.log("moonPositionControl", moonPositionControl)

		const updateLineHandler = (planet: "earth" | "moon") => {
			const index = planet === "earth" ? 0 : 1;
			const positionControl = planet === "earth" ? earthPositionControl : moonPositionControl
			return (key: string) => {
				positionControl[key as "x" | "y" | "z"].on('change', (event: TpChangeEvent<number>) => {
					console.log(`${planet} position.${key} changed to ${event.value}`)
					const p = line.geometry.attributes.position;
					switch (key) {
						case "x":
							p.setX(index, event.value)
							break
						case "y":
							p.setY(index, event.value)
							break
						case "z":
							p.setZ(index, event.value)
							break
					}
					p.needsUpdate = true

					if (earthMoonOptions.centerCameraOn === planet) {
						lookAt(new THREE.Vector3(p.getX(index), p.getY(index), p.getZ(index)))
					}
				})
			}
		}

		Object.keys(earthPositionControl).forEach(updateLineHandler("earth"))
		Object.keys(moonPositionControl).forEach(updateLineHandler("moon"))
	}
)