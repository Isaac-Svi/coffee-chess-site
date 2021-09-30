import React, {
    useState,
    createContext,
    useContext,
    useEffect,
    useCallback,
} from 'react'
import { Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const AuthContext = createContext(null)

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('Must be used in AuthProvider')
    return context
}

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(true)
    const [user, setUser] = useState({
        loading: true,
        userInfo: {},
        accessToken: '',
        socketToken: '',
    })

    const protectComponent =
        (Component, redirectRoute = '/') =>
        (props) => {
            try {
                const decoded = jwt_decode(user.accessToken)
                if (decoded.exp * 1000 < Date.now()) refresh()
                return <Component {...props} />
            } catch (err) {
                console.log(err)
                return <Redirect to={redirectRoute} />
            }
        }

    const isExp = () => {
        if (!user.accessToken) return true

        const token = jwt_decode(user.accessToken)

        return !token || token.exp * 1000 < Date.now()
    }

    const refreshToken = useCallback(() => {
        setRefresh(false)
        if (!loading) setLoading(true)

        return fetch('/api/auth/refresh', {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(({ userInfo, accessToken, socketToken, message, ok }) => {
                if (message && !Number(ok)) throw new Error(message)
                setUser({ userInfo, accessToken, socketToken })
            })
            .catch((err) => {
                console.log(err)
                // if refresh doesn't work, completely unset user
                setUser({ userInfo: '', accessToken: '', socketToken: '' })
            })
            .finally(() => setLoading(false))
    }, [loading, setRefresh, setLoading])

    const login = async (username, password) => {
        if (!username || !password) throw new Error('Please fill in all fields')

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        const { userInfo, accessToken, socketToken, message, ok } =
            await res.json()

        if (!Number(ok) && message) throw new Error(message)

        setUser({ userInfo, accessToken, socketToken })
    }

    const register = async (username, email, password) => {
        if (!username || !email || !password)
            throw new Error('Please fill in all fields')

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        })

        const { message, ok, ...data } = await res.json()

        if (!Number(ok) && message) throw new Error(message)

        console.log(message, data)
    }

    const logout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'GET',
            headers: { Authorization: `Bearer ${user.accessToken}` },
        })

        const { ok, message } = await res.json()

        if (!Number(ok) && message) throw new Error(message)

        setUser({
            userInfo: {},
            accessToken: '',
            socketToken: '',
        })
        setRefresh(true)
    }

    const value = {
        user,
        isExp,
        login,
        register,
        logout,
        refresh: () => setRefresh(true),
        protectComponent,
        loading,
    }

    useEffect(() => {
        if (refresh) refreshToken()
    }, [refresh, refreshToken])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useProtectedFetch = (
    url,
    { method = 'POST', headers = {}, body, responseType = 'json' }
) => {
    const { refresh, user, isExp } = useAuth()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isExp()) refresh()

        const options = {
            method,
            headers: {
                ...headers,
                Authorization: `Bearer ${user.accessToken}`,
            },
        }

        if (method.toUpperCase() !== 'GET') {
            options.body = body
        }

        fetch(url, options)
            .then((res) => res[responseType]())
            .then((data) => setData(data))
            .catch((err) => {
                console.log(err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [
        body,
        headers,
        isExp,
        method,
        refresh,
        responseType,
        url,
        user.accessToken,
    ])

    return { data, error, loading }
}

export default AuthProvider
export { AuthProvider, useAuth, useProtectedFetch }
