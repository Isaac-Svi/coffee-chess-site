import React from 'react'
import { useAuth } from '../providers/AuthProvider'
import { Link } from 'react-router-dom'

const PrivateLink = ({ children, ...props }) => {
    const { isExp } = useAuth()

    return !isExp() ? <Link {...props}>{children}</Link> : null
}

export default PrivateLink
