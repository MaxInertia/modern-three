import * as THREE from 'three'
import {renderer, scene, fpsGraph, gui, camera, controls, tickAnimations} from './core'
import {combineLatest} from "rxjs";
import {earth$, lineBetweenEarthAndMoon$, moon$} from "/@/space";

import './style.css'
import {WebGLRenderer} from "three";

scene.background = new THREE.Color(0, 0, 0)

// Lights
{
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
	scene.add(ambientLight)
	gui.addFolder({
		title: 'Directional Light',
	}).addBinding(ambientLight, 'intensity')

	const directionalLight = new THREE.DirectionalLight('#ffffff', 5)
	directionalLight.castShadow = true
	directionalLight.shadow.mapSize.set(1024, 1024)
	//@ts-ignore
	console.log("WebGLRenderer:", WebGLRenderer)
	directionalLight.shadow.camera.far = 15
	directionalLight.shadow.normalBias = 0.05
	directionalLight.position.set(0.25, 2, 2.25)
	scene.add(directionalLight)

	const DirectionalLightFolder = gui.addFolder({
		title: 'Directional Light',
	})
	Object.keys(directionalLight.position).forEach(key => {
		DirectionalLightFolder.addBinding(
			directionalLight.position,
			key as keyof THREE.Vector3,
			{
				min: -4,
				max: 4,
				step: 0.125,
			},
		)
	})
}

combineLatest([earth$, moon$]).subscribe(([earth, moon]) => {
	earth.castShadow = true
	moon.castShadow = true
	scene.add(earth)
	scene.add(moon)
})

lineBetweenEarthAndMoon$.subscribe((line) => {
	scene.add(line)
})

const clock = new THREE.Clock()

const loop = () => {
	const elapsedTime = clock.getElapsedTime();
	tickAnimations(elapsedTime)

	fpsGraph.begin()

	controls.update()
	renderer.render(scene, camera)

	fpsGraph.end()
	requestAnimationFrame(loop)
}

loop()
// @ts-ignore
window.scene = scene