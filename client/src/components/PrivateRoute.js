import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import Loader from './Loader'

const PrivateRoute = ({ redirect, ...props }) => {
    const { user, loading } = useAuth()

    if (loading) return <Loader />

    return !user.accessToken ? <Redirect to={redirect} /> : <Route {...props} />
}

export default PrivateRoute
