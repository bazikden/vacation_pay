import React, { useState, useContext, useEffect } from 'react'
import { Form, Input, Button, Col, Row, Alert, Space, InputNumber } from 'antd';
import { UserApi } from '../../api/api';
import { useHistory } from 'react-router';
import moment from 'moment'
import { GlobalContext } from '../../App';

const layout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
};




export const AddUserForm: React.FunctionComponent = () => {
    const [error, setError] = useState<String>("")
    const { admin } = useContext(GlobalContext)

    const history = useHistory()
    const [form] = Form.useForm()
    useEffect(() => {
        !admin && history.push('/login')
    }, [admin])
    const onFinish = async (values: any) => {
        const { name, surname, day, month, year, email } = values.user
        const data = {
            email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            surname: surname.charAt(0).toUpperCase() + surname.slice(1),
            dateOfHiring: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? '0' + day : day}`
        }

        const response = await UserApi.post(data)
        if (response.status === 200) {
            history.push('/users')
        } else {
            console.log(response)
            setError(response.data.msg)
        }

    }

    const onFinishFailed = (errorInfo: Object) => {
        console.log(errorInfo)
    }


    const onFormChange = () => {
        setError("")
    }


    return (
        <div className="block-container">
            <Row align="middle" style={{ height: '93vh' }}>
                <Col span="24">
                    <Form
                        form={form}
                        style={{ padding: "10px" }}
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onChange={onFormChange}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            name={['user', 'email']}
                            label="Email"

                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                    message: "Email is not valid"
                                },
                                { validateTrigger: "handleCreate" }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name={['user', 'name']}
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter the name"
                                },

                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['user', 'surname']}
                            label="Surname"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter surname"
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>

                            <Form.Item
                                name={['user', 'day']}
                                label="Day   "
                                initialValue={1}
                                labelAlign="left"

                            >
                                <InputNumber min={1} max={31} />
                            </Form.Item>
                            <Form.Item
                                name={['user', 'month']}
                                label="Month   "
                                initialValue={1}

                            >
                                <InputNumber min={1} max={12} />
                            </Form.Item>
                            <Form.Item
                                name={['user', 'year']}
                                label="Year  "
                                initialValue={moment().year()}


                            >
                                <InputNumber />
                            </Form.Item>
                        </Space>
                        {
                            error.length > 0 && (
                                <Col sm={{ span: 12, offset: 5 }}>
                                    <Alert style={{ marginBottom: "2em" }} message={error} type="error" />
                                </Col>
                            )
                        }

                        <Row>
                            <Col sm={{ offset: 5 }}>
                                <Form.Item  >
                                    <Button htmlType="submit" type="primary">
                                        Submit
                        </Button>
                                </Form.Item>
                            </Col>


                        </Row>

                    </Form>
                </Col>
            </Row>

        </div>
    )
}