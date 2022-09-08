import axios from "axios";
import ArtworkMpClient from "../const/axios_instance";
import { baseUrl } from "../const/url";

class Authentication {

    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    async login({ email, password }) {
        try {
            const payload = { email, password }
            const response = await ArtworkMpClient.post('/api/user/login', payload);
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }

    async register({ email, password }) {
        try {
            const payload = { email, password }
            const response = await ArtworkMpClient.post('/api/user/register', payload);
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