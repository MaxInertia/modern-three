import {FlyControls} from 'three/examples/jsm/controls/FlyControls.js'
import {camera} from './camera';
import {renderer} from './renderer';
import {FolderApi} from "@tweakpane/core";

export const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 2;
flyControls.domElement = renderer.domElement;
flyControls.rollSpeed = 0;
flyControls.enabled = false;

//@ts-expect-error
window.fly = flyControls;

export function makeFlyControlFolder(parent: FolderApi) {
	const flySpeedControl = parent.addBinding(flyControls, 'movementSpeed', {
		label: 'Movement Speed',
		min: 0,
		max: 4,
		step: 0.1,
	})
	flySpeedControl.on('change', (e) => {
		flyControls.movementSpeed = e.value;
	})
	return [flySpeedControl]
}