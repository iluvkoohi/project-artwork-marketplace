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
}
export { Profile }