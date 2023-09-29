// @ts-expect-error missing type defs
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
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

const wrapInGroup = true

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
				console.log(body + " gltf:", gltf)
				const scale = bodyRadius[body] * MODEL_SCALE

				// Set the relative size of the planet
				// then put in a group so each scale starts off at 1 in the GUI
				gltf.scene.scale.set(scale, scale, scale);
				gltf.scene.castShadow = true
				gltf.scene.receiveShadow = true
				gltf.scene.traverse(function (node) {
					// if (node instanceof THREE.Mesh) {
					// 	console.log("found mesh", node)
					// }
					node.castShadow = true;
					node.receiveShadow = true;
				});

				let object: THREE.Group
				if (wrapInGroup) {
					object = new THREE.Group()
					object.castShadow = true
					object.receiveShadow = true
					// object.scale.set(scale, scale, scale);
					object.add(gltf.scene)
				} else {
					object = gltf.scene
				}
				//@ts-ignore
				window[body] = object

				findSize(object, "wrapped " + body)
				findSize(gltf.scene, body)

				resolve(object)
			},
			// On Progress
			function (_: { loaded: number, total: number }) {
				// console.log((xhr.loaded / xhr.total * 100) + '% loaded');
			},
			// On Error
			function (error: unknown) {
				console.log('An error happened:', error);
				reject(error)
			}
		);
	})
}
