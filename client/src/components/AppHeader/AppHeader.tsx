import React, { useEffect, useState, useContext } from 'react'
import { Layout, Menu } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'
import { GlobalContext } from '../../App'
import {IContext} from "../../App"
import { AdminApi } from '../../api/api'
const { Header } = Layout



export const AppHeader: React.FunctionComponent = () => {
    const {admin,setAdmin} = useContext<IContext>(GlobalContext)

    const location = useLocation()
    const [selected,setSelected] = useState("0")
    const path = location.pathname
    

    useEffect(()=>{
        switch(path){
            case '/':
                setSelected("0")
                break
            case '/signup':
                setSelected("1")
                break
            case '/login':
                setSelected("4")
                break
            case '/users':
                setSelected("2")
                break
                
            case '/addusers':
                setSelected("3")
                break
            default: setSelected("-1")           
        } 
    },[path])

    const OnLogoutClick = async() => {
        await AdminApi.logout()
        setAdmin(null)
    }


    return (

        <Header style={{ position: 'fixed', zIndex: 1, width: '100%',top:0 }}>
            <Menu  theme="dark" mode="horizontal" selectedKeys={[selected]}>
                <Menu.Item key="0"  ><NavLink to="/">Home</NavLink></Menu.Item>
                {
                    admin && admin.isSuperAdmin && <Menu.Item key="1"><NavLink to="/signup">Add Admin</NavLink></Menu.Item>
                }
                {
                    admin && admin.isAdmin && <Menu.Item key="2"><NavLink to="/users">Users</NavLink></Menu.Item>
                }

                {
                    admin && admin.isAdmin && <Menu.Item key="3"><NavLink to="/addusers">Add Users</NavLink></Menu.Item>
                }
                {
                    admin ? <Menu.Item key="4"><NavLink to="" onClick={OnLogoutClick}>Logout</NavLink></Menu.Item>
                    :
                    <Menu.Item key="4"><NavLink to="/login">Login</NavLink></Menu.Item>
                }

            </Menu>
        </Header>
    )
}