import {gui} from "/@/core/gui";
import {makeFlyControlFolder, flyControls} from "/@/core/fly-controls";
import {makeOrbitControlFolder, orbitControls} from "/@/core/orbit-controls";

const state: {
	controlsMethod: "fly" | "orbit"
} = {
	controlsMethod: "orbit"
}

const controlsFolder = gui.addFolder({
	title: "Controls",
})
controlsFolder.expanded = false;

const controlMethod = controlsFolder.addBinding(state, 'controlsMethod', {
	label: 'Method',
	options: {
		fly: "fly",
		orbit: "orbit",
	},
});

const flyControlsInputs = makeFlyControlFolder(controlsFolder)
const orbitControlsInputs = makeOrbitControlFolder(controlsFolder)

function onControlMethodChange(e: { value: "fly" | "orbit" }) {
	if (e.value === 'fly') {
		flyControls.enabled = true;
		flyControlsInputs.forEach((input) => input.hidden = false);

		orbitControls.enabled = false;
		orbitControlsInputs.forEach((input) => input.hidden = true);

	} else if (e.value === 'orbit') {
		flyControls.enabled = false;
		flyControlsInputs.forEach((input) => input.hidden = true);

		orbitControls.enabled = true;
		orbitControlsInputs.forEach((input) => input.hidden = false);

	} else {
		throw new Error("unrecognized control type:", e.value)
	}
}

onControlMethodChange({value: state.controlsMethod})

controlMethod.on('change', onControlMethodChange)

export function updateControls() {
	if (state.controlsMethod === 'fly') {
		flyControls.update(1);
	} else if (state.controlsMethod === 'orbit') {
		orbitControls.update();
	}
}
