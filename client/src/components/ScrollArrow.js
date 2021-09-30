import React from 'react'
import { useDisplaySwitch } from './DisplaySwitch'
import '../styles/ScrollArrow.css'

const ScrollArrow = () => {
    const { names, next } = useDisplaySwitch()

    const handleClick = () => {
        if (!names.length) return
        next()()
    }

    return (
        <div className='scroll-arrow-container' onClick={handleClick}>
            <div className='scroll-arrow'>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default ScrollArrow
