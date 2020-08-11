import React, { useEffect, useState } from 'react'
import { UserApi } from '../../api/api'
import { List, Row, Col, Divider, Button } from 'antd'
import { useHistory } from 'react-router'
import Modal from 'antd/lib/modal/Modal'
import { DateOfHiring } from './Sections/DateOfHiring'

interface IUsers {
    _id: string
    name: string
    surname: string
    dateOfHiring: string
}


interface IUserContext {
    users: []
    setUsers: Function
}


export default function Users() {
    const [users, setUsers] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [userId, setUserId] = useState("")
    const history = useHistory()

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
    }, [])

    const onAddBtnClick = (id: string) => {
        history.push(`/users/${id}`)
    }

    const onDelete = async (id: string) => {
        const response = await UserApi.deleteUser(id)
        response.status === 204 && setUsers((prevUsers) => [...prevUsers.filter((user: any) => user._id !== id)])
    }

    const toggle = (id: string) => {
        setUserId(id)
        setIsOpen(true)
    }
    const onOkClick = async () => {
        await onDelete(userId)
        setIsOpen(false)
    }

    const onCancelClick = () => {
        setIsOpen(false)
    }


    return (
        <div className="block-container">

            <Modal
                okType="danger"
                title="Delete User"
                visible={isOpen}
                onOk={onOkClick}
                onCancel={onCancelClick}
            >
                <p>Remove this User ?</p>
            </Modal>
            {
                users && users.length === 0 && <h1 style={{ marginTop: "50px", textAlign: "center" }}>There is no Users Yet</h1>
            }
            {
                users && users.length > 0 && (
                    <List
                        style={{ margin: '20px' }}
                        size="large"
                        header={<Divider orientation="left">Users</Divider>}
                        bordered
                        dataSource={users}
                        renderItem={(user: IUsers, index) => (

                            <List.Item>
                                <Row style={{ width: '100%' }} justify="space-between" align="middle">
                                    <Col span={6}>
                                        <span style={{ fontSize: '20px' }}>{index + 1}.  {user.name} {user.surname}</span>
                                    </Col>
                                    <Col span={10}>
                                        <DateOfHiring user={user} />
                                    </Col >
                                    <Col style={{ justifySelf: 'flex-end' }} >
                                        <Button onClick={() => onAddBtnClick(user._id)} style={{ margin: '0 10px' }} type="primary">Info</Button>
                                        <Button onClick={() => toggle(user._id)} type="primary" danger>Delete</Button>
                                    </Col>
                                </Row>
                            </List.Item>

                        )}
                    />
                )
            }

        </div>
    )
}
