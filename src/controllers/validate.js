import ArtworkMpClient from "../const/axios_instance";

class Validate {
    async request() {
        try {
            const response = await ArtworkMpClient.get('/api/validate/http-request');
            return response.status;
        } catch (error) {
            return error.response.status;
        }
    }
}

export { Validate }