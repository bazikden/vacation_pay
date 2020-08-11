import { UserApi } from "../api/api"
import moment from 'moment'


export const convertToMoment = (date: string) => {
    const arr = date.split('-')
    arr[1] = (+arr[1] - 1).toString()
    return moment(arr)
}

export const getDateArray = async (startDate: string, endDate: string, lastVacationStartDate: string = "", lastVacationDays: number = 0) => {
    const dateFormat = 'YYYY-MM-DD'
    let startMonth: any = null
    const lastMonthDays = []
    if (lastVacationStartDate.length > 0) {
        startMonth = convertToMoment(lastVacationStartDate).startOf("month")
        const lastDayBeforeVacation = convertToMoment(lastVacationStartDate)
        const lastMonthDaysCount = lastDayBeforeVacation.diff(startMonth, "days")

        for (let i = 0; i < lastMonthDaysCount; i++) {
            lastMonthDays.push(startMonth.format(dateFormat))
            startMonth.add(1, "day")
        }
    }



    const start = convertToMoment(startDate)
    const end = moment(convertToMoment(endDate)).startOf('month').subtract(1, 'days')

    const datesArr: string[] = []
    const days = end.diff(start, 'days')
    for (let i = 0; i <= days; i++) {
        datesArr.push(start.format('YYYY-MM-DD'))
        start.add(1, "day")
    }
    const years = []
    const startYear = startDate.split('-')[0]
    const endYear = endDate.split('-')[0]

    if (startYear === endYear) {
        years.push(endYear)
    } else {
        years.push(startYear, endYear)
    }

    const holidays: string[] = []
    const holidaysArr = await years.map(async (year) => {
        try {
            const response = await UserApi.getHolidays(year)
            console.log("Response",response)
            const data = response.data.response.holidays.filter((holiday: any) => holiday.type[0] === "National holiday")

            data.forEach((elem: any) => {
                const date = convertToMoment(elem.date.iso)
                const startCount = startMonth ? convertToMoment((startMonth).startOf("month").format(dateFormat)) : startDate
                if (date.isBefore(endDate) && date.isAfter(startCount) || (date.isSame(startCount) || date.isSame(endDate))) {
                    date.day() !== 0 && date.day() !== 6 && holidays.push(elem.date.iso)
                }
            })


        } catch (error) {
            console.log(error)
            alert('Cannot connect to holidays server')
            return null
        }
    })
    await Promise.all(holidaysArr)
    let result: string[] = [...datesArr]
    if (lastMonthDays.length > 0) result.push(...lastMonthDays)
    holidays.forEach(elem => {
        result = result.filter(date => date !== elem)
    })
    return result
}

export const getDaysObject = (dates: string[]) => {
    const data: any = {
        jan: dates.filter((date: string) => date.split('-')[1] === '01'),
        feb: dates.filter((date: string) => date.split('-')[1] === '02'),
        mar: dates.filter((date: string) => date.split('-')[1] === '03'),
        apr: dates.filter((date: string) => date.split('-')[1] === '04'),
        may: dates.filter((date: string) => date.split('-')[1] === '05'),
        jun: dates.filter((date: string) => date.split('-')[1] === '06'),
        jul: dates.filter((date: string) => date.split('-')[1] === '07'),
        aug: dates.filter((date: string) => date.split('-')[1] === '08'),
        sep: dates.filter((date: string) => date.split('-')[1] === '09'),
        oct: dates.filter((date: string) => date.split('-')[1] === '10'),
        nov: dates.filter((date: string) => date.split('-')[1] === '11'),
        dec: dates.filter((date: string) => date.split('-')[1] === '12'),
    }

    const newData: any = {}
    for (let key in data) {
        data[key].length !== 0 && (newData[key] = data[key])
    }
    return newData
}

export const getSalaryObject = (salary: number = 0, tags: string[]) => {
    const data: any = {}
    tags.forEach((elem: string) => {
        data[`${elem.slice(0, 3).toLocaleLowerCase()}`] = salary
    })
    return data

}

export const getRenderedTags = (startDate: string, endDate: string, userInfo?: any) => {
    const tags = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const addMonth:string[] = []
    if (userInfo !== undefined && userInfo) { 
        for(let key in userInfo[1]){
            tags.forEach((tag:string)=> {
                tag.toLowerCase() === key && addMonth.push(tag)
            })
        }
    }

    const startMonthIndex = +startDate.slice(5, 7)
    const endMonthIndex = +endDate.slice(5, 7)
    const renderedTags: string[] = []
    const startYear = startDate.slice(0, 4)
    const endYear = endDate.slice(0, 4)
    if (startYear === endYear) {
        tags.forEach((tag: string, index: number) => {
            if ((index + 1 >= startMonthIndex) && (index + 1 < endMonthIndex)) {
                renderedTags.push(tag)
            }
        })
    } else {
        tags.forEach((tag: string, index: number) => {
            if (index + 1 >= startMonthIndex) {
                renderedTags.push(tag)
            }
        })

        tags.forEach((tag: string, index: number) => {
            if (index + 1 < endMonthIndex) {
                renderedTags.push(tag)
            }
        })

    
    }
    addMonth.forEach((tag:string)=>{
        const checkTag = renderedTags.find(elem => elem === tag)
        checkTag === undefined && renderedTags.unshift(tag)
    })
     
    const uniq = Array.from(new Set(renderedTags));
    return uniq

}

export const getUserDataArray = (dataObj: any, user: any) => {
    for (let key in dataObj) {
        const objData = dataObj[key].map((elem: any, index: number) => {
            const data: any = {
                key: key + index + Date.now(),
                january: elem.jan,
                february: elem.feb,
                march: elem.mar,
                april: elem.apr,
                may: elem.may,
                june: elem.jun,
                july: elem.jul,
                august: elem.aug,
                september: elem.sep,
                october: elem.oct,
                november: elem.nov,
                december: elem.dec,
                count: elem.count,
                userId: user._id,
                sent: elem.sent
            }
            if (elem.salaryItemId) {
                data.salaryInfoId = elem.salaryItemId
                data.workedDaysId = elem._id
                data.vacationEndDate = elem.vacationEndDate
                data.vacationDays = elem.vacationDays
            } else {
                data.salaryInfoId = elem._id
            }
            elem.vacationPay && (data.vacationPay = elem.vacationPay)
            elem.startDate && (data.startDate = elem.startDate)
            elem.endDate && (data.endDate = elem.endDate)
            elem.userInfoId && (data.userInfoId = elem.userInfoId)
            for (let key in data) {
                data[key] === undefined && delete data[key]
            }
            return data
        })
        dataObj[key] = objData
    }
    const dataArr: any = []
    dataObj.days.forEach((elem: any, index: number) => {
        dataArr.push(
            {
                key: `${+Date.now() * index + 1 + 'eMptyFieldYuserInfoTable' + index}`,
                date: `${elem.startDate} - ${elem.endDate}`,
                vacationDays: `${elem.endDate} - ${moment(elem.vacationEndDate).subtract(1, "day").format("YYYY-MM-DD")}`,
                workedDaysId: elem.workedDaysId,
                salaryInfoId: elem.salaryInfoId,
                vacationPay: dataObj.salary[index].vacationPay,
                userInfoId: elem.userInfoId,
                userId: elem.userId,
                vacationEndDate: elem.vacationEndDate
            },
            elem,
            dataObj.salary[index]
        )
    })

    return dataArr

}