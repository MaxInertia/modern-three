import {combineLatest, map, shareReplay, take} from "rxjs";
import {makeAddRotationFunction, setupCommonControls} from "/@/space/util";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {loadPlanet} from "/@/space/planet";

const moonOptions = {
	rotate: false,
}

const onMoonControlsLoaded = [
	makeAddRotationFunction(moonOptions),
];

export const moon$ = fromPromise(loadPlanet('moon')).pipe(shareReplay({refCount: true, bufferSize: 1}))

export const {moonControls$, moonPositionControl$} = (() => {
	const all$ = moon$.pipe(
		take(1),
		map((moon) => {
			const moonControls = setupCommonControls('Moon', moon)
			return {
				moonControls,
				moonPositionControl: {
					x: moonControls.addBinding(moon.position, 'x', {
						min: -1000,
						max: 1000,
						step: 1,
					}),
					y: moonControls.addBinding(moon.position, 'y', {
						min: -1000,
						max: 1000,
						step: 1,
					}),
					z: moonControls.addBinding(moon.position, 'z', {
						min: -1000,
						max: 1000,
						step: 1,
					}),
				}
			}
		}),
		shareReplay({refCount: true, bufferSize: 1})
	)
	return {
		moonControls$: all$.pipe(map(v => v.moonControls)),
		moonPositionControl$: all$.pipe(map(v => v.moonPositionControl))
	}
})()

combineLatest([moon$, moonControls$]).subscribe(([moon, controls]) => {
	onMoonControlsLoaded.forEach(fn => fn(moon, controls))
})