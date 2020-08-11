import React, { useState, useEffect } from 'react';
import { AppHeader } from './components/AppHeader/AppHeader';
import { Router } from './components/Router/Router';
import { AdminApi } from './api/api';
import Cookies from 'js-cookie'

interface IAdmin {
  email: String
  isAdmin: Boolean
  isSuperAdmin: Boolean
}

export interface IContext {
  setUsers: Function
  users: any[],
  admin: IAdmin,
  setAdmin: Function
}

export const GlobalContext = React.createContext<any>({})

function App() {

  const [admin, setAdmin] = useState<any>(null)
  const token = Cookies.get('token')
  useEffect(() => {
    const authUser = async () => {
      try {
        const response = await AdminApi.auth()
        if (response !== undefined && response.status === 200) {
          setAdmin(response.data.user)

        }

      } catch (error) {
        console.log(error)
      }
    }
    token !== undefined && authUser()

  }, [])


  return (
    <GlobalContext.Provider value={{ admin, setAdmin }}>
      <div className="App">
        <AppHeader />

        <Router />
      </div>

    </GlobalContext.Provider>
  );
}

export default App;
