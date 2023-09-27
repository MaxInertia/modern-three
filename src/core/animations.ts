type AnimationHandler = (elapsedTime: number) => void
let animations: AnimationHandler[] = []

export function removeAnimation(f: AnimationHandler) {
	animations = animations.filter(fn => fn !== f)
}

export function addAnimation(f: AnimationHandler) {
	animations.push(f)
}

export function tickAnimations(elapsedTime: number) {
	animations.forEach((fn) => fn(elapsedTime))
}