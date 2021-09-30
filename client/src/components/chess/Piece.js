import React, { Component } from 'react'
import { hoveredSquare } from '../../providers/HoveredSquare'

export default class Piece extends Component {
    constructor(props) {
        super(props)

        this.mouseDown = false
    }

    componentDidMount() {
        this.square = this.$el.parentNode
    }

    handleMouseDown = () => {
        this.$el.classList.add('active')
        this.mouseDown = true
    }

    handleMouseUp = () => {
        if (!this.mouseDown) return

        this.$el.classList.remove('active')
        this.$el.style.top = 'unset'
        this.$el.style.left = 'unset'
        this.mouseDown = false

        this.makeMove()
    }

    handleMouseMove = (e) => {
        if (!this.mouseDown) return

        const pieceWidth = this.$el.offsetWidth

        this.$el.style.top = e.clientY - pieceWidth / 2 + 'px'
        this.$el.style.left = e.clientX - pieceWidth / 2 + 'px'
    }

    makeMove = () => {
        const hoveredSquareId = hoveredSquare.id

        // hoveredSquare.innerHTML = ''
        // hoveredSquare.append(this.$el)

        this.square = hoveredSquareId
    }

    render() {
        return (
            <i
                ref={(el) => (this.$el = el)}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
                className={`piece fas fa-chess-${this.props.type} ${this.props.color}`}
            ></i>
        )
    }
}
