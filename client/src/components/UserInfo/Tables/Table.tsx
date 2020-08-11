import React, { useEffect, useState, useRef } from 'react'
import { Table, Divider, Button, Modal } from 'antd'
import { UserInfoApi } from '../../../api/api';
import { getRenderedTags } from '../../../utils/utils';

const { Column } = Table;


const renderContent = (value: any, row: any, index: any) => {
    const obj: any = {
        children: value,
        props: {}
    };
    if (index % 3 === 0) {
        obj.props.colSpan = 0;
    }
    return obj;
};



export const UserTable = ({ userInfo }: any) => {
    const [months, setMonths] = useState<string[]>([])
    const [data, setData] = useState([])
    const [info, setInfo] = useState<any>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenMailModal, setIsOpenMailModal] = useState<boolean>(false)
    const [mailModalInfo, setMailModalInfo] = useState<any>(null)

    const sentMail = useRef<HTMLDivElement>(null)
    const unBlock = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        const startDate = userInfo[1].startDate
        const endDate = userInfo[1].endDate
        const renderedTags = getRenderedTags(startDate, endDate, userInfo)
        setMonths(renderedTags)
        setData(userInfo)
    }, [])


    const mapColumns = (tag: string, index: number) => {
        if (index === 0) {
            return (
                <Column
                    title={tag}
                    key={tag + index + Date.now()}
                    dataIndex={`${tag.toLowerCase()}`}
                    render={(text: any, row: any, rowIndex: any) => renderFirstCol(text, row, rowIndex, index)}
                />

            )
        } else {
            return (
                <Column
                    title={tag}
                    key={tag + index + Date.now()}
                    dataIndex={`${tag.toLowerCase()}`}
                    render={renderContent}

                />

            )
        }


    }

    const renderFirstCol = (text: any, row: any, rowIndex: any, index: number) => {

        if (rowIndex % 3 !== 0) {
            return <span>{text}</span>;
        } else {
            const dates = row.vacationDays.split(" ")
            const newDates = dates.map((elem: string) => {
                if (elem.length > 1) {
                    const reversed = elem.split("-").reverse().join("-")
                    return reversed
                } else {
                    return elem + "---"

                }
            }).join("  ")
            return {
                children: <Divider>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                        <div> {newDates}</div><br />
                        <div>Pay: {row.vacationPay}</div>
                    </div>


                </Divider>,
                props: {
                    colSpan: months.length,
                },
            };

        }
    }


    const onDeleteBtnClick = (row: any) => {
        setInfo(row)
        setIsOpen(true)
    }

    const onSendClick = async (row: any) => {
        setInfo(row)
        const data = {
            workedDaysId: row.workedDaysId,
            salaryInfoId: row.salaryInfoId,
            userInfoId: row.userInfoId,
            userId: row.userId
        }
        const response = await UserInfoApi.sendMail(data)
        setMailModalInfo(response.data)
        setIsOpenMailModal(true)
    }

    const onOkClick = async () => {
        const { userInfoId, salaryInfoId, workedDaysId } = info
        const newData = data.filter((elem: any) => elem.workedDaysId !== workedDaysId).filter((elem: any) => elem.salaryInfoId !== salaryInfoId)

        const response = await UserInfoApi.deleteInfo(userInfoId, workedDaysId, salaryInfoId)
        if (response.status === 200) {
            setIsOpen(false)
            setData(newData)
        } else {

            alert('Something wrong with server')
        }

    }

    const onCancelClick = () => {
        setIsOpen((prevState: Boolean) => !prevState)
    }

    const onSentMailClick = async (status = true) => {
        try {
            const id = userInfo[1].workedDaysId
            const data = { id, status}
            await UserInfoApi.sendMailStatus(data)
            if(status){
                sentMail.current!.classList.add('sent')
                unBlock.current!.classList.add('sent')
                setIsOpenMailModal(false)
            }else{
                sentMail.current!.classList.remove('sent')
                unBlock.current!.classList.remove('sent')
            } 
            console.log(sentMail.current!.classList)
        } catch (error) {
            console.log(error)
        }

    }

    const onCancelMailClick = () => {
        setIsOpenMailModal(false)
    }



    return (
        <div >
            <Modal
                okType="danger"
                title="Delete record"
                visible={isOpen}
                onOk={onOkClick}
                onCancel={onCancelClick}
            >
                <p>Remove this record ?</p>
            </Modal>
            <Modal
                okType="primary"
                okText="Make sent"
                title="User link"
                visible={isOpenMailModal}
                onOk={() =>onSentMailClick()}
                onCancel={onCancelMailClick}
            >
                {
                    mailModalInfo && (
                        <>
                            <p>User :  {mailModalInfo.user.name}  {mailModalInfo.user.name}</p>
                            <p>Email:  {mailModalInfo.user.email}</p>
                            <p>Link:   <a href={mailModalInfo.link}>{mailModalInfo.link}</a></p>

                        </>
                    )
                }
            </Modal>
            <div className="table-block">
                <div ref={sentMail} className={userInfo[1].sent?"sent-mail sent":"sent-mail"}></div>
                <Button ref={unBlock} onClick={() =>onSentMailClick(false)} className={userInfo[1].sent?"unblock-btn sent":"unblock-btn"} type="primary" >Unblock</Button>
                <div style={{ display: "flex", justifyContent: "space-between", color: "white", fontSize: "20px", padding: "0 20px", marginTop: "50px", background: "#001529" }}>
                    <div >{userInfo[0].date.split(" ")[0].slice(0, 4)}</div>
                    <div >{userInfo[0].date.split(" ")[2].slice(0, 4)}</div>
                </div>
                <Table style={{ margin: '0 auto' }} pagination={false} dataSource={data} size="small" bordered>
                    {
                        months.map(mapColumns)
                    }
                    <Column width="135px" title="Count" key={Date.now()} dataIndex="count" render={(text, record, index) => {
                        if (index % 3 === 0) {
                            return <>
                                <Button style={{ display: "block", width: "100px", margin: "10px auto" }} onClick={() => onSendClick(record)} type="primary" >Send email</Button><br />
                                <Button style={{ display: 'block', margin: '0 auto' }} onClick={() => onDeleteBtnClick(record)} type="primary" danger>Delete</Button>
                            </>

                        } else {
                            return <span>{text}</span>
                        }

                    }} />
                </Table>
            </div>
        </div>
    )
}
