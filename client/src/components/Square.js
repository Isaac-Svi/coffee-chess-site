import React, { useRef } from 'react'

const Square = ({ _id, children }) => {
    const squareRef = useRef()

    return (
        <div ref={squareRef} className='square' id={_id}>
            {children}
        </div>
    )
}

export default Square
