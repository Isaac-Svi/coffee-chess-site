import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import ErrorHandler from './components/ErrorHandler'
import GamePage from './pages/GamePage'

const Routes = () => {
    return (
        <ErrorHandler>
            <Switch>
                <Route path='/' exact component={HomePage} />
                <PublicRoute
                    path='/register'
                    redirect='/'
                    exact
                    component={RegisterPage}
                />
                <PrivateRoute
                    path='/game/:gameId'
                    redirect='/'
                    exact
                    component={GamePage}
                />
                <Route path='*' component={() => <div>Not found</div>} />
            </Switch>
        </ErrorHandler>
    )
}

export default Routes
