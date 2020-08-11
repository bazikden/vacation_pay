import React, { useState, useEffect } from 'react'
import { Col, InputNumber, Row, Divider } from 'antd'

interface IProps {
    inputdata: any,
    name: string,
    returnData:Function,
    fieldName:string,
    tags:string []
}

interface IData {
    jan: number
    feb: number
    mar: number
    apr: number
    may: number
    jun: number
    jul: number
    aug: number
    sep: number
    oct: number
    nov: number
    des: number
    
}

export const Inputs = ({ inputdata, name, returnData, fieldName, tags }: IProps) => {
    const [daysCount, setDaysCount] = useState(0)
    const [data, setData] = useState<IData | any>({})
    const calculateDays = (data: any) => {
        let result = 0
        for (let key in data) {
            result += data[key]
        }
        return result
    }


    useEffect(() => {
        const count: any = {}
        for (let key in inputdata) {
            count[key] = Array.isArray(inputdata[key]) ? +inputdata[key].length : + inputdata[key]
        }
        setData(count)
    }, [inputdata])


    useEffect(() => {
        const count = calculateDays(data)
        setDaysCount(count)
        count > 0 && returnData(fieldName,{...data,count})
    }, [data])

    const onInputChange: any = (name: string) => (value: number) => {
        setData({ ...data, [name]: value })
    }
    const mapInputs = (tag: string) => (<Col key={tag + Date.now}>
        <label htmlFor={tag.toLowerCase()}>{tag}</label> <br />
        <InputNumber min={0} onChange={onInputChange(tag.slice(0, 3).toLowerCase())} name={tag.toLowerCase()} value={data[`${tag.slice(0, 3).toLowerCase()}`]} />
    </Col>)

    
    return (
        <div>
                    <Divider style={{color:"#1890ff",fontSize:'1.5em'}} plain orientation="center">{name}</Divider>

            <Row justify="space-between">
                {tags.map(mapInputs)}
                <Col>
                    <label style={{ fontWeight: 700, display: 'block', textAlign: "center", color: "#1890ff" }} > Count</label>
                    <InputNumber min={0} name="daysCount" value={daysCount} />
                </Col>
            </Row>

        </div>
    )
}
