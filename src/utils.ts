import * as THREE from "three";

export function findSize(object: THREE.Object3D, label?: string) {
	const boundingBox = new THREE.Box3().setFromObject(object);
	const dimensions = new THREE.Vector3();
	boundingBox.getSize(dimensions);
	const width = dimensions.x;
	const height = dimensions.y;
	const depth = dimensions.z;
	console.log(`${label ? label : "?"}: Width: ${width}, Height: ${height}, Depth: ${depth}`);
}

export function makeLineBetween(p1: THREE.Vector3, p2: THREE.Vector3): THREE.Line {
	const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
	const material = new THREE.LineBasicMaterial({color: 0xff0000});
	return new THREE.Line(geometry, material)
}

export function makeSphere(): THREE.Mesh {
	const R = 31.85 //bodyRadius['earth'] * MODEL_SCALE;
	const sphereGeometry = new THREE.SphereGeometry(R, 64, 64);
	const sphereMaterial = new THREE.MeshBasicMaterial({
		color: 0xbb00ff,
		transparent: true,
		opacity: 0.3,
	});
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereMesh.position.set(0, 0, 0)
	findSize(sphereMesh, "sphere")
	return sphereMesh
}

