import * as THREE from 'three'
import {renderer, scene} from './core/renderer'
import {fpsGraph, gui} from './core/gui'
import camera from './core/camera'
import {controls} from './core/orbit-control'

import './style.css'

// Shaders
import {DISTANCE_SCALE, DISTANCE_TO_MOON, loadPlanet} from "/@/space/planet";
import {makeLineBetween} from "/@/utils";

const config = {
	centerCameraOnMoon: false,
}

// Lights
{
	const ambientLight = new THREE.AmbientLight(0xffffff, 5)
	scene.add(ambientLight)
	gui.addFolder({
		title: 'Directional Light',
	}).addInput(ambientLight, 'intensity')

	const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
	directionalLight.castShadow = true
	directionalLight.shadow.mapSize.set(1024, 1024)
	directionalLight.shadow.camera.far = 15
	directionalLight.shadow.normalBias = 0.05
	directionalLight.position.set(0.25, 2, 2.25)
	scene.add(directionalLight)

	const DirectionalLightFolder = gui.addFolder({
		title: 'Directional Light',
	})
	Object.keys(directionalLight.position).forEach(key => {
		DirectionalLightFolder.addInput(
			directionalLight.position,
			key as keyof THREE.Vector3,
			{
				min: -100,
				max: 100,
				step: 1,
			},
		)
	})
}


const earth$ = loadPlanet('earth')
const moon$ = loadPlanet('moon')
Promise.all([earth$, moon$]).then(([earth, moon]) => {
	const dx = DISTANCE_TO_MOON * DISTANCE_SCALE
	moon.position.set(earth.position.x + dx, earth.position.y, earth.position.z)

	scene.add(earth)
	scene.add(moon)

	function setupCommonControls(bodyName: string, object: THREE.Group) {
		// object.receiveShadow = true;
		const folder = gui.addFolder({title: `${bodyName}`})
		folder.addInput(object, 'scale')
		folder.addInput(object, 'position')
		return folder
	}

	setupCommonControls('Earth', earth)
	const moonControls = setupCommonControls('Moon', moon)

	const line = makeLineBetween(earth.position, moon.position)
	scene.add(line)

	moonControls.addInput(line, "visible", {
		label: "Show line to moon"
	})
	moonControls.addInput(config, "centerCameraOnMoon", {
		label: "Center camera on moon"
	}).on('change', event => {
		console.log("value:", event.value)
		if (event.value) {
			controls.target = moon.position;
			camera.position.set(
				moon.position.x + 80,
				moon.position.y,
				moon.position.z + 80,
			)
			camera.lookAt(moon.position)
		} else {
			controls.target = earth.position;
			camera.position.set(
				earth.position.x + 80,
				earth.position.y,
				earth.position.z + 80,
			)
			camera.lookAt(earth.position)
		}
	})
})

// const clock = new THREE.Clock()

const loop = () => {
	// const elapsedTime = clock.getElapsedTime()

	fpsGraph.begin()

	controls.update()
	renderer.render(scene, camera)

	fpsGraph.end()
	requestAnimationFrame(loop)
}

loop()
console.log(scene)
// @ts-ignore
window.scene = scene