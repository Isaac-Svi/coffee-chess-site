import React from 'react'
import {
    DisplaySwitch,
    DisplaySwitchProvider,
} from '../components/DisplaySwitch'
import GameLobby from '../components/GameLobby'
import Landing from '../components/Landing'
import ScrollArrow from '../components/ScrollArrow'

const HomePage = () => {
    return (
        <DisplaySwitchProvider>
            <DisplaySwitch>
                <Landing name='landing' />
                <GameLobby name='lobby' />
            </DisplaySwitch>
            <ScrollArrow />
        </DisplaySwitchProvider>
    )
}

export default HomePage
