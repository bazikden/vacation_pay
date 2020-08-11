import React, { useState, useEffect } from 'react'
import { Row, Col, Avatar } from 'antd'
import { useParams } from 'react-router'
import WorkingDaysPickers from './Sections/WorkingDaysPickers/WorkingDaysPickers'
import { UserApi, UserInfoApi } from '../../api/api'





export interface IUser {
    _id: string,
    name: string,
    surname: string,
    dateOfHiring: string
}


export default function UserInfo() {
    const [users, setUsers] = useState([])
    const [userInfo, setUserInfo] = useState<any>(null)

    useEffect(() => {

        const getUsers = async () => {
            const response = await UserApi.get()
            if (response !== undefined) {
                response.status === 200 && setUsers(response.data.users)
            } else {
                alert('Cannot connect to server')
            }
        }
        getUsers()
        const getUserInfo = async () => {
            const info = await UserInfoApi.getUserData(params.id)
            info.data.days.length > 0 && setUserInfo(info)
        }
        getUserInfo()
    }, [])


    const params: { id: string } = useParams()
    const [user, setUser] = useState<IUser>({
        _id: '',
        name: '',
        surname: '',
        dateOfHiring: ''
    })

    useEffect(() => {
        if (users.length > 0) {
            const user = users.find((user: IUser) => user._id === params.id)
            user !== undefined && setUser(user)

        }
    }, [users])

    return (
        <div style={{ margin: '10px 20px' }} className="block-container">
            <Row justify="space-between" align="middle">
                <Col>
                    <Avatar
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#1890ff',
                            marginRight: "10px"
                        }}
                    >U
                    </Avatar>
                    <span style={{ fontSize: '18px' }}>{user.name}  {user.surname}</span>
                </Col>
                <Col>

                    <span>Date of Hiring : {user.dateOfHiring.split("-").reverse().join("-")} </span>

                </Col>
            </Row>
            {
                user._id && (
                    <>
                        <WorkingDaysPickers user={user} userInfo={userInfo}  />
                    </>
                )
            }


        </div>
    )
}
