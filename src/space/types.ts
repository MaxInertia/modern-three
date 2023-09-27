import * as THREE from "three";
import {FolderApi} from "@tweakpane/core";

export type Planet = THREE.Group<THREE.Object3DEventMap>

export type OnPlanetLoadedFn =
	| ((planet: Planet, controls: FolderApi) => void)
	| ((earth: Planet) => void)


export type PlanetControlsFolder = FolderApi