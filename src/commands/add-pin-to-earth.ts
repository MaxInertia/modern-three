import {earth$, earthControls$} from "/@/space/earth";
import * as THREE from "three";
import {makeLineBetween, makeSphere} from "/@/utils";
import {combineLatest} from "rxjs";
import {FolderApi} from "@tweakpane/core";

type LatLong = {
	lat: number,
	lon: number,
	r?: number,
}

type AddPinToEarthOptions = {
	label?: string,
	color?: string | number
}

const defaultCoords = {
	lat: 52.083625, // polar angle in degrees
	lon: -106.626616, // azimuth angle in degrees
	r: 520,
}

const defaultOptions = {
	color: '#ff0000',
}

export function addPinToEarth(
	latLong: LatLong = {...defaultCoords},
	options: AddPinToEarthOptions = defaultOptions,
) {
	let pin: THREE.Line | null = null
	let pinControl: FolderApi | null = null
	let pinControlParent: FolderApi | null = null

	if (!options.color) options.color = defaultOptions.color
	if (!latLong.lat) latLong.lat = defaultCoords.lat
	if (!latLong.lon) latLong.lon = defaultCoords.lon
	if (!latLong.r) latLong.r = defaultCoords.r

	combineLatest([earth$, earthControls$]).pipe(
		// TODO: Why is this called immediately?
		// finalize(() => {
		// 	pin?.parent?.remove?.(pin)
		// 	pinControlParent?.remove(pinControl)
		// 	console.log({pinControlParent, pinControl})
		// })
	).subscribe(([_earth, _control]) => {
		const earth = _earth.children[0]

		function latLonToVector3({lat, lon, r}: LatLong) {
			const latRad = THREE.MathUtils.degToRad(lat)
			const lonRad = -THREE.MathUtils.degToRad(lon)
			const R = r ?? defaultCoords.r
			return new THREE.Vector3(
				R * Math.cos(latRad) * Math.cos(lonRad - Math.PI / 2),
				R * Math.sin(latRad),
				R * Math.cos(latRad) * Math.sin(lonRad - Math.PI / 2),
			)
		}

		const zero = new THREE.Vector3(0, 0, 0)
		const coords = latLonToVector3(latLong)
		// let color = typeof options.color === 'string' ? parseInt(options.color) : options.color;
		let color = options.color
		const line = makeLineBetween(zero, coords, {color})
		const sphere = makeSphere(4, {color})
		line.add(sphere)
		sphere.position.set(coords.x, coords.y, coords.z)
		earth.add(line)

		pin = line
		pinControlParent = _control
		pinControl = _control.addFolder({
			title: options?.label ?? '',
		})
		console.log({pin, pinControl, pinControlParent})

		const colorControl = pinControl.addBinding(options, 'color')
		const longitudeControl = pinControl.addBinding(latLong, 'lon', {
			label: 'longitude',
			max: 180,
			min: -180,
			step: 0.1,
		})
		const latitudeControl = pinControl.addBinding(latLong, 'lat', {
			label: "latitude",
			max: 90,
			min: -90,
			step: 0.1,
		})
		const rControl = pinControl.addBinding(latLong, 'r', {
			label: "r",
			max: 2000,
			min: 400,
			step: 1,
		})

		function updateLinePosition() {
			const v3 = latLonToVector3(latLong)
			line.geometry.attributes.position.setXYZ(1, v3.x, v3.y, v3.z)
			line.geometry.attributes.position.needsUpdate = true
			sphere.position.set(v3.x, v3.y, v3.z)
		}

		colorControl.on('change', (e) => {
			console.log("color changed:", e.value, "string?", typeof e.value === 'string')
			const color = new THREE.Color(e.value)
			//@ts-ignore
			line.material.color = color
			//@ts-ignore
			sphere.material.color = color
		})
		longitudeControl.on('change', (e) => {
			latLong.lon = e.value
			updateLinePosition()
		})
		latitudeControl.on('change', (e) => {
			latLong.lat = e.value
			updateLinePosition()
		})
		rControl.on('change', (e) => {
			latLong.r = e.value
			updateLinePosition()
		})
	})

	return () => {
		pin?.parent?.remove?.(pin)
		// TODO: Remove control
		// pinControlParent?.remove(pinControl)
	}
}

//@ts-ignore
window.addPin = addPinToEarth
