export default class Mouse {
    constructor() {
        this.x = undefined
        this.y = undefined
        window.addEventListener('mousemove', this.trackMouse.bind(this))
    }

    trackMouse(event) {
        this.x = event.clientX
        this.y = event.clientY
    }
}
