import React, { useState, useEffect } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { InputNumber, Button } from 'antd'
import { UserInfoApi } from '../../../api/api'

export const DateOfHiring = ({ user }: any) => {
    const [editMode, setEditMode] = useState(false)
    const [date,setDate] = useState<string>(user.dateOfHiring)
    console.log(user)
    const toggleEditMode = () => {
        setEditMode(prevState => !prevState)
    }
    

    useEffect(()=> {console.log(date)},[date])

    const onDayChange = (value:any) => {
        let newValue = value    
        value < 10 && (newValue = "0" + value) 
            setDate((prevState:string) =>{
                const olddate = prevState
                const data = olddate.split("-")
                data[2] = newValue
                return data.join("-")
            })
    }

    const onMonthChange = (value:any) => {
        let newValue = value    
        value < 10 && (newValue = "0" + value) 
            setDate((prevState:string) =>{
                const olddate = prevState
                const data = olddate.split("-")
                data[1] = newValue
                return data.join("-")
            })
    }

    const onYearChange = (value:any) => {
        let newValue = value    
        value < 10 && (newValue = "0" + value) 
            setDate((prevState:string) =>{
                const olddate = prevState
                const data = olddate.split("-")
                data[0] = newValue
                return data.join("-")
            })
    }
    const onOkClick = async() => {
        const data = {
            id:user._id,
            date
        }

        await UserInfoApi.updateUserDate(data)
        toggleEditMode()
    }

    return (
        <div>
            {
                editMode ?
                    <div>
                        <span>Day</span><InputNumber onChange={onDayChange} min={1} max={31} defaultValue={+date.split("-")[2]} />
                        <span>Month</span><InputNumber onChange={onMonthChange} min={1} max={12} defaultValue={+date.split("-")[1]}/>
                        <span>Year</span><InputNumber onChange={onYearChange} min={2000} defaultValue={+date.split("-")[0]}/>
                        <Button onClick={onOkClick} type='primary'>Ok</Button>
                    </div>
                    :
                    <div>
                        <span style={{ fontSize: '18px' }}>
                            Date of Hiring: {date.split("-").reverse().join("-")}
                        </span>
                        <EditOutlined onClick={toggleEditMode} style={{ margin: '0 10px', width: '30px', cursor: "pointer" }} />
                    </div>
            }


        </div>
    )
}
