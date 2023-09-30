import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {camera} from './camera'
import {renderer} from './renderer'
import * as THREE from "three";
import {BindingApi, FolderApi} from "@tweakpane/core";

export const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true
orbitControls.maxDistance = 100
orbitControls.minDistance = 10
orbitControls.autoRotate = false

//@ts-expect-error
window.orbit = orbitControls;

export function lookAt(p: THREE.Vector3) {
	// TODO: Move position so that the same viewing angle can be maintained
	orbitControls.target = p;
	camera.position.set(
		p.x + 80,
		p.y,
		p.z + 80,
	)
	camera.lookAt(p)
}

export function makeOrbitControlFolder(parent: FolderApi): BindingApi[] {
	return [
		parent.addBinding(orbitControls, "autoRotate", {
			label: "Auto rotate"
		}),
		parent.addBinding(orbitControls, 'maxDistance', {
			label: 'Max distance',
			min: 0,
			max: 500,
			step: 10,
		}),
		parent.addBinding(orbitControls, 'minDistance', {
			label: 'Min distance',
			// 16 units is ~ the radius of the earth
			min: 16,
			max: 200,
			step: 1,
		}),
	]
}