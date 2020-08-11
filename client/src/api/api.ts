import  Cookies  from 'js-cookie';
import axios, { AxiosInstance, AxiosResponse } from 'axios'

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000"
})

const token = Cookies.get('token')
if(token !== undefined) api.defaults.headers.authorization = token



class UserApi {
    static async get() {
        try {
            const response: AxiosResponse = await api.get('/users')
            return response
        } catch (error) {
            return error.response
        }
    }

    static async post(data: Object) {
        try {
            const response: AxiosResponse = await api.post('/users', data)
            return response
        } catch (error) {
            return error.response
        }
    }

    static async getHolidays(year: string) {

        try {
            const response = await api.get(`/holidays?year=${year}`)
            if(response.data === null){
                    const response: AxiosResponse = await axios.get(`https://calendarific.com/api/v2/holidays?api_key=efe1f205ada984657725a963cb9b1e0af10762ad&country=UA&year=${year}`)
                    const requestData = {
                        data:response,
                        year
                    }
                    await api.post('/holidays',requestData)
                    return response
            }else{

                const data = response.data.holidays
                return data
            }

        } catch (error) {
            console.log(error)
            return error.response
        }
    }

    static async deleteUser(id: string) {
        try {
            const response: AxiosResponse = await api.delete(`/users/${id}`)
            return response
        } catch (error) {
            return error.response
        }
    }
}


class UserInfoApi {
    static async post(data: object) {
        try {
            const response: AxiosResponse = await api.post(`/user-info`, data)
            return response
        } catch (error) {
            return error.response
        }
    }
    static async getUserData(id?: string) {
        try {
            let response: AxiosResponse
            if (id !== undefined) {
                response = await api.get(`/user-info/?id=${id}`)
            } else {
                response = await api.get(`/user-info`)
            }
            return response
        } catch (error) {
            return error.response
        }
    }
    static async deleteInfo(id:string,workedDaysId:string,salaryInfoId:string) {
        try {
            const data = {workedDaysId,salaryInfoId}
            const response: AxiosResponse = await api.put(`/user-info/${id}`,data)
            return response
        } catch (error) {
            return error.response
        }
    }

    static async sendMail(data:any) {
        try {
          
            const response: AxiosResponse = await api.post(`/sendmail`,data)
            return response
        } catch (error) {
            return error.response
        }
    }

    static async sendMailStatus(data:any) {
        try {
          
            const response: AxiosResponse = await api.put(`/sendmail`,data)
            return response
        } catch (error) {
            return error.response
        }
    }

    static async getUserInfo(token:string) {
        try {
          
            const response: AxiosResponse = await api.get(`/user-info/${token}`)
            return response
        } catch (error) {
            return error.response
        }
    }

    static async updateUserDate(data:{id:string,date:string}) {
        try {
             const response: AxiosResponse = await api.put(`/user-info`,data)
            return response
        } catch (error) {
            return error.response
        }
    }

    
}

class AdminApi {
    static async signup(data: object) {
        try {
            const response: AxiosResponse = await api.post(`/admin/signup`, data)
            return response
        } catch (error) {
            return error.response
        }
    }
    static async login(data: object) {
        try {
            const response: AxiosResponse = await api.post(`/admin/login`, data)
            api.defaults.headers.authorization = response.data.token
            return response
        } catch (error) {
            return error.response
        }
    }

    static async auth(){
        try {
            const response: AxiosResponse = await api.get(`/admin`)
            return response
        } catch (error) {
            return error.response
        }
    }

    static async logout(){
        Cookies.remove('token')
        delete api.defaults.headers.authorization
    }
}

export { UserApi, UserInfoApi, AdminApi }