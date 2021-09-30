import React, { Component } from 'react'
import Mouse from '../../utils/Mouse'

const mouse = new Mouse()

export default class Square extends Component {
    static currentId = 63
    static openSquare = null
    static checkMousePosition(square) {
        const { left, right, top, bottom } = square.$el.getBoundingClientRect()

        const checkX =
            mouse.x >= Math.floor(left) && mouse.x <= Math.ceil(right)
        const checkY =
            mouse.y >= Math.floor(top) && mouse.y <= Math.ceil(bottom)

        return checkX && checkY && square.id === Square.openSquare.id
    }

    constructor(props) {
        super(props)
        this.number = Square.currentId
        this.id = `sq-${Square.currentId--}`
        this._id = props._id
        this.open = false
    }

    componentDidMount() {
        this.$row = this.$el.parentNode
        this._addEventListeners()
    }

    _addEventListeners() {
        this.$el.addEventListener('mousemove', this.handleMouseMove.bind(this))
        this.$el.addEventListener(
            'mouseleave',
            this.handleMouseLeave.bind(this)
        )
    }

    handleMouseMove() {
        this.open = true
        Square.openSquare = this
    }

    handleMouseLeave() {
        this.open = false
    }

    render() {
        return (
            <div
                ref={(el) => (this.$el = el)}
                className='square'
                id={this.id}
                data-id={this._id}
            ></div>
        )
    }
}
