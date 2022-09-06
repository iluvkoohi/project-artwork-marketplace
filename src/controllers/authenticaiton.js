import axios from "axios";
import { baseUrl } from "../const/url";

class Authentication {

    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    async login({ email, password }) {
        try {
            const response = await axios.post(`${baseUrl}/api/user/login`, {
                email, password
            });
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }

    async register({ email, password }) {
        try {
            const response = await axios.post(`${baseUrl}/api/user/register`, {
                email, password
            });
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }

    async changePassword({ email, password, newPassword }) {
        try {
            const response = await axios.post(`${baseUrl}/api/user/change-password`, {
                email, password, newPassword
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

}

export {
    Authentication
}