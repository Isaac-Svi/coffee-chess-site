import React from 'react'
import Nav from './components/Nav'
import AuthProvider from './providers/AuthProvider'
import SocketProvider from './providers/SocketProvider'
import Routes from './Routes'

const App = () => {
    return (
        <AuthProvider>
            <SocketProvider>
                <Nav />
                <Routes />
            </SocketProvider>
        </AuthProvider>
    )
}

export default App
