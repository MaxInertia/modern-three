import * as THREE from "three";
import {LineBasicMaterialParameters} from "three";

export function findSize(object: THREE.Object3D, label?: string) {
	const boundingBox = new THREE.Box3().setFromObject(object);
	const dimensions = new THREE.Vector3();
	boundingBox.getSize(dimensions);
	const width = dimensions.x;
	const height = dimensions.y;
	const depth = dimensions.z;
	console.log(`${label ? label : "?"}: Width: ${width}, Height: ${height}, Depth: ${depth}`);
}

export function makeLineBetween(p1: THREE.Vector3, p2: THREE.Vector3, parameters: LineBasicMaterialParameters = {}): THREE.Line {
	const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
	const material = new THREE.LineBasicMaterial({
		color: 0xff0000,
		...parameters,
	});
	return new THREE.Line(geometry, material)
}

// Earth sized ball:  radius = bodyRadius['earth'] * MODEL_SCALE; // 31.85
export function makeSphere(radius: number, params?: THREE.MeshBasicMaterialParameters): THREE.Mesh {
	if (!params) params = {}
	const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
	const sphereMaterial = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		transparent: true,
		...params,
	});
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereMesh.position.set(0, 0, 0)
	findSize(sphereMesh, "sphere")
	return sphereMesh
}

