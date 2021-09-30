import Mouse from '../utils/Mouse'

const _mouse = new Mouse()

export let hoveredSquare = ''

export const checkHoveredSquare = (square) => {
    const { left, right, top, bottom } = square.getBoundingClientRect()

    const checkX = _mouse.x >= Math.floor(left) && _mouse.x <= Math.ceil(right)
    const checkY = _mouse.y >= Math.floor(top) && _mouse.y <= Math.ceil(bottom)

    return checkX && checkY
}

export const setHoveredSquare = () => {
    const squares = document.querySelectorAll('.square')

    for (const square of squares) {
        if (checkHoveredSquare(square)) {
            hoveredSquare = square
            return
        }
    }
}
