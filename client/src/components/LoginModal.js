import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

const LoginModal = ({ isOpen }) => {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await login(username, password)
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        }
    }

    return (
        <form
            className={`modal login-modal fade-in-${isOpen ? 'down' : 'up'}`}
            onSubmit={handleSubmit}
        >
            {error && <div className='error-msg'>{error}</div>}
            <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
            />
            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
            />
            <button className='simple-btn'>Log In</button>
            <p>
                Don't have an account? Register <Link to='/register'>here</Link>
            </p>
        </form>
    )
}

export default LoginModal
