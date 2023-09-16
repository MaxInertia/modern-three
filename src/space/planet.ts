// @ts-ignore
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from 'three'
import {findSize} from "/@/utils";

// Instantiate a loader
const loader = new GLTFLoader();


type BodyInSpace = 'earth' | 'moon'

export const bodyRadius: Record<BodyInSpace, number> = {
	'earth': 6371,
	'moon': 1737.4,
}

export const MODEL_SCALE = 1 / 200000
export const DISTANCE_SCALE = 1 / 400
export const DISTANCE_TO_MOON = 384400

const bodyToFilePath: Record<BodyInSpace, string> = {
	"earth": 'Earth_1_12756.glb',
	"moon": 'Moon_1_3474.glb',
}

export interface GLTF {
	scene: THREE.Group,
	scenes: THREE.Group[],
	cameras: THREE.Camera[],
	animations: THREE.AnimationClip[]
	asset: { generator: string, version: string },
	parser: unknown,
}

export function loadPlanet(body: BodyInSpace) {
	// Load a glTF resource
	return new Promise<THREE.Group>((resolve, reject) => {
		loader.load(
			// resource URL
			bodyToFilePath[body],
			// called when the resource is loaded
			function (gltf: GLTF) {
				console.log("gltf:", gltf)
				const scale = bodyRadius[body] * MODEL_SCALE

				// Set the relative size of the planet
				// then put in a group so each scale starts off at 1 in the GUI
				gltf.scene.scale.set(scale, scale, scale);

				const object = new THREE.Group()
				// object.scale.set(scale, scale, scale);
				object.add(gltf.scene)

				//@ts-ignore
				window[body] = object

				findSize(object, "wrapped " + body)
				findSize(gltf.scene, body)

				resolve(object)
			},
			// On Progress
			function (xhr: any) {
				console.log((xhr.loaded / xhr.total * 100) + '% loaded');
			},
			// On Error
			function (error: unknown) {
				console.log('An error happened:', error);
				reject(error)
			}
		);
	})
}

