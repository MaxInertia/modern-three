import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {camera} from './camera'
import {renderer} from './renderer'
import * as THREE from "three";

export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

controls.maxZoom = 0
controls.autoRotate = false

export function lookAt(p: THREE.Vector3) {
	// TODO: Move position so that the same viewing angle can be maintained
	controls.target = p;
	camera.position.set(
		p.x + 80,
		p.y,
		p.z + 80,
	)
	camera.lookAt(p)
}