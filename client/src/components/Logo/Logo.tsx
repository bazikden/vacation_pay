import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router'
import { UserInfoApi } from '../../api/api'
import logo from './Logo.png'

export const Logo = () => {
    const params:{token:string} = useParams()
    const [data,setData] = useState<any>(null)
    useEffect(()=> {
        if(params.token){
            const sendAsync = async() => {
                const response = await UserInfoApi.getUserInfo(params.token)
                console.log(response)
                if(response.status === 200){
                    setData(response.data)
                }
            }
            sendAsync()
        }
    },[])

    return (
        <div className="block-container">
          <div style={{width:'500px',margin:'100px auto',overflow:"hidden"}}>
            <img alt="" style={{width:'100%',height:"100%"}}  src={logo}></img>

          </div>
          {
              data && (
                  <div style={{width:'300px',margin:'100px auto',fontSize:'18px'}}>
                      <h3 style={{textAlign:"center"}}>{data.name} {data.surname}</h3>
                      <p>Vacation : {data.startVacation.split("-").reverse().join("-")} - {data.endVacation.split("-").reverse().join("-")} </p>
                      <p>Vacation Days : {data.vacationDays}</p>
                      <p>Pay : {data.pay}</p>
                  </div>
              )
          }

        </div>
    )
}
