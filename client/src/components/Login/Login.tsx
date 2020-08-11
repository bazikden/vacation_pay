import React, { useState, useContext } from 'react'
import { Form, Input, Button, Col, Row, Alert } from 'antd';
import { AdminApi } from '../../api/api';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { GlobalContext } from '../../App';

const layout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
};




export const Login: React.FunctionComponent = () => {
    const [error, setError] = useState<String>("")
    const {setAdmin} = useContext(GlobalContext)
    const history = useHistory()
    const [form] = Form.useForm()
    const onFinish = async (values: any) => {
        const data = values.user
        const response = await AdminApi.login(data)
        if (response.status === 200) {
            await Cookies.set('token', response.data['token']);
            const authResponse = await AdminApi.auth()
            setAdmin(authResponse.data.user)

            history.push('/users')
        } else {

            response.status === 400 ? setError(response.data.error) : setError(response.statusText)
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
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['user', 'password']}
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    min: 5,
                                    message: "Must be more than 5 symbols"

                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

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