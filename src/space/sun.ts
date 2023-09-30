import * as THREE from "three";
import {WebGLRenderer} from "three";
import {of} from "rxjs";
import {gui} from "/@/core";

export const sun$ = of((() => {
	const directionalLight = new THREE.DirectionalLight('#ffffff', 5)
	directionalLight.castShadow = true
	directionalLight.shadow.mapSize.set(1024, 1024)
	directionalLight.shadow.camera.far = 15
	directionalLight.shadow.normalBias = 0.05
	//@ts-ignore
	console.log("WebGLRenderer:", WebGLRenderer)

	const state = {
		lat: 0,
		lon: 0,
		r: 10000,
	}

	const p = polarToEuclidean(state.lat, state.lon, state.r)
	directionalLight.position.set(p.x, p.y, p.z)

	const control = gui.addFolder({
		title: 'Sun',
	})

	const longitudeControl = control.addBinding(state, 'lon', {
		label: 'longitude',
		max: 180,
		min: -180,
		step: 0.1,
	})
	const latitudeControl = control.addBinding(state, 'lat', {
		label: "latitude",
		max: 90,
		min: -90,
		step: 0.1,
	})

	longitudeControl.on('change', (e) => {
		state.lon = e.value
		const p = polarToEuclidean(state.lat, state.lon, state.r)
		directionalLight.position.set(p.x, p.y, p.z)
	})
	latitudeControl.on('change', (e) => {
		state.lat = e.value
		const p = polarToEuclidean(state.lat, state.lon, state.r)
		directionalLight.position.set(p.x, p.y, p.z)
	})

	return directionalLight
})())

export function polarToEuclidean(lat: number, lon: number, r: number): THREE.Vector3 {
	const latRad = THREE.MathUtils.degToRad(lat)
	const lonRad = -THREE.MathUtils.degToRad(lon)
	return new THREE.Vector3(
		r * Math.cos(latRad) * Math.cos(lonRad - Math.PI / 2),
		r * Math.sin(latRad),
		r * Math.cos(latRad) * Math.sin(lonRad - Math.PI / 2),
	)
}
