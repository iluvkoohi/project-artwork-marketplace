import ArtworkMpClient from "../const/axios_instance";

class Profile {
    async get() {
        try {
            const response = await ArtworkMpClient.get('/api/profile/own');
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
    async create(data) {
        try {
            const response = await ArtworkMpClient.post('/api/profile', data);
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
    async update(data) {
        try {
            const response = await ArtworkMpClient.put('/api/profile', data);
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
    async updateAvatar(data) {
        try {
            const response = await ArtworkMpClient.put('/api/profile/avatar', data);
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
}
export { Profile }