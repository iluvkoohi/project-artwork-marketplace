import ArtworkMpClient from "../const/axios_instance";

class Profile {
    async get() {
        try {
            const response = await ArtworkMpClient.get('/api/profile/own');
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }
}
export { Profile }