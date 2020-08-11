import React from 'react'
import { Route } from 'react-router'
import { Login } from '../Login/Login'
import { Signup } from '../Signup/SignUp'
import Users from '../Users/Users'
import UserInfo from '../UserInfo/UserInfo'
import { AddUserForm } from '../Form/AddUserForm'
import { Logo } from '../Logo/Logo'
import { PrivateRoute } from '../../hoc/PrivateRoute.jsx'

export const Router = () => {
    return (
        <>

            <Route exact path="/" render={() => <Logo />} />
            <Route exact path="/userinfo/:token" render={() => <Logo />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" render={() => <PrivateRoute component={Signup}/>} />
            <Route exact path="/users" render={() => <PrivateRoute component={Users}/>} />
            <Route exact path="/addusers" render={() => <PrivateRoute component={AddUserForm}/>} />
            <Route exact path="/users/:id" render={() => <PrivateRoute component={UserInfo}/>} />
        </>
    )
}