import {loadPlanet} from "/@/space/planet";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

export const earth$ = fromPromise(loadPlanet('earth'))
export const moon$ = fromPromise(loadPlanet('moon'))