import React, { useContext, createContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000/socket')

const SocketContext = createContext(null)

const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) throw new Error('Must be used in SocketProvider')
    return context
}

const SocketProvider = ({ children }) => {
    const { user } = useAuth()
    const [rooms, setRooms] = useState(new Set())
    const [currentRoom, setCurrentRoom] = useState(null)
    const [secureSocket, setSecureSocket] = useState(null)

    // resets socket whenever user changes
    useEffect(() => {
        if (user.socketToken) {
            setSecureSocket(
                io('http://localhost:5000/secure-socket', {
                    auth: {
                        token: user.socketToken,
                    },
                })
            )
        }
    }, [user])

    useEffect(() => {
        if (secureSocket) {
            secureSocket.emit('joined server', user)
        }
    }, [secureSocket, user])

    const value = {
        socket,
        secureSocket,
        rooms,
        setRooms,
        currentRoom,
        setCurrentRoom,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
export { SocketProvider, useSocket }
