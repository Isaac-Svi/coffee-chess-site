import React from 'react'
import '../styles/CoffeeMug.css'

const CoffeeMug = ({ baseSize, classes = null }) => {
    return (
        <div
            className={'coffee-mug ' + (classes ? classes.join(' ') : '')}
            style={{ fontSize: baseSize }}
        >
            <div className='smoke'>
                <span style={{ '--i': 1, '--p': 1 }}></span>
                <span style={{ '--i': 7, '--p': 2 }}></span>
                <span style={{ '--i': 3, '--p': 3 }}></span>
                <span style={{ '--i': 6, '--p': 4 }}></span>
                <span style={{ '--i': 2, '--p': 5 }}></span>
                <span style={{ '--i': 8, '--p': 6 }}></span>
                <span style={{ '--i': 5, '--p': 7 }}></span>
                <span style={{ '--i': 9, '--p': 8 }}></span>
                <span style={{ '--i': 4, '--p': 9 }}></span>
            </div>
            <div className='mug'></div>
        </div>
    )
}

export default CoffeeMug
