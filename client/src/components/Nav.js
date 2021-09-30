import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLink from './PublicLink'
import PrivateLink from './PrivateLink'
import CoffeeMug from './CoffeeMug'
import '../styles/Nav.css'
import '../styles/LoginModal.css'
import detectUpwardClick from '../utils/detectUpwardClick'
import LoginModal from './LoginModal'
import { useAuth } from '../providers/AuthProvider'

const Nav = () => {
    const { logout, user } = useAuth()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        const hideModals = (e) => {
            if (showModal && !detectUpwardClick(e.target, 'modal', ['a']))
                setShowModal(false)
        }
        window.addEventListener('click', hideModals)

        return () => window.removeEventListener('click', hideModals)
    }, [showModal])

    return (
        <>
            <input type='checkbox' id='toggler' />
            <nav>
                <div id='logo'>
                    <CoffeeMug baseSize='3px' />
                    <Link style={{ marginLeft: '1em' }} to='/'>
                        Coffee Chess
                    </Link>
                </div>
                <ul>
                    {/* <PrivateLink to='/chess' redirect='/'>
                        Chess
                    </PrivateLink> */}
                    <PrivateLink
                        to='#'
                        className='display-btn'
                        onClick={logout}
                    >
                        Log Out
                    </PrivateLink>
                    {!user.accessToken && (
                        <li>
                            <PublicLink
                                to='#'
                                id='login-btn'
                                className='display-btn'
                                onClick={() => setShowModal((x) => !x)}
                            >
                                Log In
                            </PublicLink>
                            <LoginModal
                                isOpen={showModal}
                                toggleOpen={setShowModal}
                            />
                        </li>
                    )}
                </ul>
                <label htmlFor='toggler'></label>
            </nav>
        </>
    )
}

export default Nav
