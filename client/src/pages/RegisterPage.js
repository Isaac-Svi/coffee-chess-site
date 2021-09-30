import React, { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import DropDownModal from '../components/DropDownModal'
import '../styles/RegisterPage.css'
import Loader from '../components/Loader'

const RegisterPage = ({ history }) => {
    const { register } = useAuth()
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { username, email, password } = userInfo
        try {
            await register(username, email, password)
            setSuccess(true)
            setUserInfo({
                username: '',
                email: '',
                password: '',
            })
        } catch (err) {
            console.log(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleModalClose = () => {
        setSuccess(false)
        history.push('/')
        document.getElementById('login-btn').click()
    }

    return (
        <>
            {success && (
                <DropDownModal close={handleModalClose}>
                    <p>
                        Account created successfully. Log in to access your
                        account.
                    </p>
                </DropDownModal>
            )}
            <form className='register-form' onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <div className='error-msg'>{error}</div>}
                <input
                    type='text'
                    value={userInfo.username}
                    name='username'
                    onChange={handleChange}
                    placeholder='Username'
                />
                <input
                    type='email'
                    value={userInfo.email}
                    name='email'
                    onChange={handleChange}
                    placeholder='Email'
                />
                <input
                    type='password'
                    value={userInfo.password}
                    name='password'
                    onChange={handleChange}
                    placeholder='Password'
                />
                {loading ? (
                    <Loader />
                ) : (
                    <button className='simple-btn'>Sign Up</button>
                )}
            </form>
        </>
    )
}

export default RegisterPage
