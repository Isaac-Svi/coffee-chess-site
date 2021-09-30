import React from 'react'
import CoffeeMug from './CoffeeMug'
import '../styles/Landing.css'

const Landing = ({ name }) => {
    return (
        <div className='landing' id={name}>
            <h1>Grab a cup, and get started</h1>
            <CoffeeMug baseSize='20px' classes={['slide-in']} />
        </div>
    )
}

export default Landing
