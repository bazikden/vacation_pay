import React, { useState, useEffect } from 'react'
import { IUser } from '../../UserInfo'
import { UserTable } from '../../Tables/Table'
import { getUserDataArray } from '../../../../utils/utils'
import { UserInfoApi } from '../../../../api/api'

interface IProps {
    user: IUser
    userInfo: any
}


export const UserInfoTables = ({ user, userInfo }: IProps) => {
    const [data, setData] = useState<[]>([])
    const [tablesData, setTablesData] = useState<any[]>([])

    let tableData: any[] = []
    useEffect(() => {
        const stateData: any[] = []
        data.forEach((elem: any, index: number) => {
            if ((index + 1) % 3 !== 0) {
                tableData.push(elem)
            } else {
                tableData.push(elem)
                stateData.push(tableData)
                tableData = []
            }
        })

        setTablesData(stateData)
    }, [data])
    useEffect(() => {
        
        const getUserInfo = async () => {
            const info = await UserInfoApi.getUserData(user._id)
            const dataArr = getUserDataArray(info.data,user)
             setData(dataArr)
            
        }
        getUserInfo()

    }, [])

    return (
        <div >
            {
                tablesData.length > 0 && tablesData.reverse().map((userInfoElem: any) => userInfoElem && <UserTable key={userInfoElem[0].key} userInfo={userInfoElem}  />)
            }
        </div>
    )
}
