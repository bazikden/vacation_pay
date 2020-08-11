import React, { useContext } from 'react'
import { GlobalContext } from '../App'
import { useLocation, useHistory } from 'react-router'

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const location = useLocation()
    const history = useHistory()
    const { admin } = useContext(GlobalContext)
    if (location.pathname === "/signup") {
        if (admin && admin.isSuperAdmin) {
            return <Component {...rest} />
        }
        else {
            history.push("/")
            return <></>
        }
    } else {
        if (admin) {
            return <Component {...rest} />
        }
        else {
            history.push("/")
            return <></>
        }

    }


}