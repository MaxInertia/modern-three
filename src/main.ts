import * as THREE from 'three'
import {renderer, scene, fpsGraph, gui, camera, controls, tickAnimations} from './core'
import {combineLatest} from "rxjs";
import {earth$, lineBetweenEarthAndMoon$, moon$} from "/@/space";

import './style.css'
import "/@/commands/add-pin-to-earth";
import {addPinToEarth} from "/@/commands/add-pin-to-earth";
import {sun$} from "/@/space/sun";

scene.background = new THREE.Color(0, 0, 0)

// Lights
{
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.45)
	scene.add(ambientLight)
	gui.addFolder({
		title: 'Ambient Light',
	}).addBinding(ambientLight, 'intensity', {
		label: 'intensity',
		min: 0,
		max: 4,
		step: 0.05,
	})
}

combineLatest([earth$, moon$]).subscribe(([earth, moon]) => {
	earth.castShadow = true
	moon.castShadow = true
	scene.add(earth)
	scene.add(moon)
})

sun$.subscribe((sun) => {
	scene.add(sun)
})

lineBetweenEarthAndMoon$.subscribe((line) => {
	scene.add(line)
})

addPinToEarth()

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