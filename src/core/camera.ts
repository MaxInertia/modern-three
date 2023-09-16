import {PerspectiveCamera} from 'three'
import {scene, sizes} from './renderer'

const VERTICAL_FIELD_OF_VIEW = 45 // degrees 45 is the normal

export const camera = new PerspectiveCamera(
	VERTICAL_FIELD_OF_VIEW,
	sizes.width / sizes.height,
)

// @ts-ignore
window.camera = camera

camera.position.set(80, 0, 80)
camera.far = Number.MAX_VALUE
camera.near = 0.1
// @ts-ignore
camera.logarithmicDepthBuffer = true

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
})

scene.add(camera)

export default camera
