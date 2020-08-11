import React, { useState, useEffect } from 'react'
import { Row, Col, DatePicker, InputNumber, Button } from 'antd'
import moment from 'moment'
import { IUser } from '../../UserInfo'
import { Inputs } from '../WorkingDaysInputs/WorkingDaysInputs'
import { getDateArray, getDaysObject, getSalaryObject, getRenderedTags } from '../../../../utils/utils'
import { UserInfoApi } from '../../../../api/api'
import { useHistory } from 'react-router'
import { UserInfoTables } from '../UserInfoTables/UserInfoTables'





interface IProps {
    user: IUser
    userInfo:any

}

export default function WorkingDaysPickers({ user, userInfo }: IProps) {
    const dateFormat = "DD-MM-YYYY"
    const reversedFormat = "YYYY-MM-DD"
    const [addInfo, setAddInfo] = useState(false)
    const history = useHistory()
    const [vacationDates, setVacationDates] = useState<any>({
        start: '10-04-2015',
        startVacation: moment(Date.now()).format("YYYY-MM-DD"),
        endVacation: moment(Date.now()).format("YYYY-MM-DD"),
    })

    const [tags,setTags] =useState<any>([])

    useEffect(()=>{
        userInfo ? 
        setVacationDates((prevDates:any) => {return{...prevDates,start:userInfo.data.days[userInfo.data.days.length -1].vacationEndDate}})
        :  
        setVacationDates((prevDates:any) => {return{...prevDates,start:user.dateOfHiring}})

    },[userInfo])

    useEffect(()=> {

    },[])
    const [dates, setDates] = useState({})
    const [salary, setSalary] = useState({})
    const [inputData, setInputData] = useState<any>({})
    const [vacationDays, setVacationDays] = useState(0)
    const [vacationPay, setVacationPay] = useState(0)


    const returnData = (name: string, data: any) => {
        setInputData({ ...inputData, [`${name}`]: data })
    }

    useEffect(() => {
        user._id.length === 0 && history.push('/users')
    }, [user])

    

    const onStartDateChange = (date: any, dateString: string) => {
        if(dateString === ""){
            setVacationDates((prevState: any) => { return { ...prevState, start: moment(Date.now()).format(dateFormat) } })
        }else{
            setVacationDates((prevState: any) => { return { ...prevState, start: dateString } })

        }
    }

    const onStartVacationDateChange = (date: any, dateString: string) => {
        if(dateString === ""){
            setVacationDates((prevState: any) => { return { ...prevState, startVacation: moment(Date.now()).format(reversedFormat) } })
        }else{
            setVacationDates((prevState: any) => { return { ...prevState, startVacation: dateString.split("-").reverse().join("-") } })

        }
        setVacationDays(moment(vacationDates.endVacation).diff(moment(date),"days"))

    }
    const onEndVacationDateChange = (date: any, dateString: string) => {
        const data = dateString.split("-").reverse().join("-")
        if(dateString === ""){
            setVacationDates((prevState: any) => { return { ...prevState, endVacation: moment(Date.now()).format(reversedFormat) } })
        }else{
            setVacationDates((prevState: any) => { return { ...prevState, endVacation: dateString.split("-").reverse().join("-") } })

        }
        setVacationDays(moment(date).diff(moment(vacationDates.startVacation),"days"))

    }



    const onVacationDaysChange = (value: any) => {
        setVacationDays(+value)
    }

    const onCalcClick = async () => {
        const start = moment(vacationDates.start, reversedFormat)
        const end = moment(vacationDates.startVacation, reversedFormat)
        console.log("------------------",start,end)
        const tags = getRenderedTags(start.format(reversedFormat),end.format(reversedFormat),userInfo)
        
        setTags(tags)
        const difference = end.diff(start)
        if (difference > 0) {
            let datesArray
            if(userInfo && userInfo.data.days.length > 0){
             const elem  = userInfo.data.days[userInfo.data.days.length-1]   
             datesArray = await getDateArray(vacationDates.start, vacationDates.startVacation,elem.endDate,+elem.vacationDays)

            }else{
                datesArray = await getDateArray(vacationDates.start, vacationDates.startVacation)

            }
            const daysObject = getDaysObject(datesArray)
            const salary = 0
            console.log(tags)
            const salaryObject = getSalaryObject(salary,tags)
            setDates(daysObject)
            setSalary(salaryObject)

        } else alert('Start date must be less then End date')

    }

    const onCalcVacationPayClick = () => {
        if(inputData.salary === undefined){
            alert("Please enter the salary")
        }else{
            console.log(inputData.salary.count)
            const pay = inputData.salary.count / inputData.days.count * vacationDays
            console.log(pay)
            setVacationPay(Math.ceil(pay))

        }
    }

    const onAddUserDataClick = async () => {
        const { days, salary } = inputData
        const data = {
            user,
            days,
            salary,
            vacationPay,
            dates: vacationDates,
            vacationDays
        }
        console.log("data",data)
        const result = await UserInfoApi.post(data)
        if (result.status === 200) {
            history.push('/users')
        } else {
            alert("Cannot save data")
            console.log(result.data.error)
        }

    }
    const onToggleAddInfo = () => {
        setAddInfo(prevState => !prevState)
    }
    return (
        <>
            <Row justify="center" style={{marginBottom:'20px'}}>
                <Button onClick={onToggleAddInfo} type='primary'>Add User Info</Button>
            </Row>
            { addInfo ?
            <div>
                <Row justify="center" style={{ margin: '10px 0' }}>
                    <Col style={{ marginRight: '20px' }}>
                        <span>Start Day</span><br />
                        <DatePicker disabled onChange={onStartDateChange} name="start" value={moment(vacationDates.start)} format={dateFormat} />
                    </Col>
                    <Col style={{ marginRight: '20px' }}>
                        <span>Start Vacation</span><br />
                        <DatePicker onChange={onStartVacationDateChange} name="end"  value={moment(vacationDates.startVacation)} format={dateFormat} />
                    </Col>
                    <Col style={{ marginRight: '20px' }}>
                        <span>End Vacation</span><br />
                        <DatePicker onChange={onEndVacationDateChange} name="end"  value={moment(vacationDates.endVacation)} format={dateFormat} />
                    </Col>
                    <Col style={{ marginRight: '20px' }}>
                        <span>Vacation Days</span><br />
                        <InputNumber onChange={onVacationDaysChange} value={vacationDays} />
                    </Col>
                    <Col >
                        <br />
                        <Button onClick={onCalcClick} type="primary" block>Calculate</Button>
                    </Col>
                </Row>

                {Object.keys(dates).length > 0 && <Inputs returnData={returnData} tags={tags}  fieldName="days" name="Working Days" inputdata={dates} />}
                {Object.keys(salary).length > 0 && <Inputs returnData={returnData} tags={tags} fieldName="salary" name="Salary" inputdata={salary} />}
                {
                    Object.keys(inputData).length > 0 && (
                        <>
                            {
                                vacationPay > 0 && (
                                    <Row style={{ margin: '20px 0' }} justify="center">
                                        <Col>
                                            <h2>Pay : {vacationPay} </h2>
                                        </Col>
                                    </Row>
                                )
                            }
                            <Row style={{ margin: '20px 0' }} justify="center">
                                <Col>
                                    <Button onClick={onCalcVacationPayClick} type="primary">Calculate Vacation Pay </Button>
                                </Col>
                            </Row>
                            {
                                vacationPay > 0 && (
                                    <Row style={{ margin: '20px 0' }} justify="center">
                                        <Col>
                                            <Button onClick={onAddUserDataClick} type="primary">Add User Data</Button>
                                        </Col>
                                    </Row>

                                )
                            }
                        </>
                    )
                }

            </div>
            :
                
            userInfo && <>
                <UserInfoTables user={user} userInfo={userInfo} />
            </>

            }
           
        </>
    )
}
