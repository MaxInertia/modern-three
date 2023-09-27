import * as THREE from "three";
import {gui} from "/@/core/gui";
import {FolderApi} from "@tweakpane/core";
import {addAnimation, removeAnimation} from "/@/core";

type Planet = THREE.Group<THREE.Object3DEventMap>

export function setupCommonControls(bodyName: string, object: THREE.Group) {
	const folder = gui.addFolder({title: `${bodyName}`})
	folder.addBinding(object, 'scale')
	return folder
}

export function makeAddRotationFunction(options: { rotate: boolean }) {
	return function (planet: Planet, controls: FolderApi) {
		const clock = new THREE.Clock()
		let pausedElapsedTime = 0;

		const animationDuration = 10; // 5 seconds in milliseconds
		let currentRotation: THREE.Euler
		// const currentRotation = new THREE.Euler().setFromQuaternion(earth.children[0].quaternion);

		const fn = (_: number) => {
			const elapsedTime = clock.getElapsedTime() - pausedElapsedTime;
			pausedElapsedTime = 0
			planet.children[0].rotation.y = (elapsedTime % animationDuration) / animationDuration * Math.PI * 2;
		}

		controls.addBinding(options, "rotate", {
			label: "rotate"
		}).on('change', event => {
			if (event.value) {
				if (!clock.running) {
					// pausedElapsedTime = clock.getElapsedTime() - pausedElapsedTime;
					clock.start()
				}
				currentRotation = new THREE.Euler().setFromQuaternion(planet.children[0].quaternion);
				addAnimation(fn)
				console.log("current rotation:", currentRotation)
			} else {
				if (clock.running) {
					clock.stop()
					pausedElapsedTime = clock.oldTime;
				}
				removeAnimation(fn)
			}
		})
	}
}
