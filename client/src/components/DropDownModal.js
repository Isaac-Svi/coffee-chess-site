import React, { useState, useEffect } from 'react'
import Chain from 'anilink'
import '../styles/DropDownModal.css'

const DropDownModal = ({ close, children }) => {
    const [animation, setAnimation] = useState('')

    const handleClose = async () => {
        new Chain(250)
            .cb(() => setAnimation('close'))
            .cb(close)
            .exec()
    }

    useEffect(() => {
        new Chain(250).cb(() => setAnimation('open')).exec()
    }, [])

    return (
        <>
            <div className={`overlay ${animation}`} onClick={handleClose}></div>
            <div className={`modal dropdown-modal ${animation}`}>
                <i className='close-btn fas fa-times' onClick={handleClose}></i>
                {children}
            </div>
        </>
    )
}

export default DropDownModal
