import ArtworkMpClient from "../const/axios_instance";
import imageCompression from 'browser-image-compression';

class Ticket {
    async createVerificationTicket(imageFile) {
        try {
            const formData = new FormData();
            const compressedFile = await imageCompression(imageFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            });
            formData.append("images", compressedFile)

            const response = await ArtworkMpClient.post('/api/ticket/verification', formData);
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
    async getVerificationTickets() {
        try {
            const response = await ArtworkMpClient.get('/api/ticket/verification', {
                params: { status: "pending" }
            });
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
    async updateVerificationTicketStatus(data) {
        try {
            const response = await ArtworkMpClient.put('/api/ticket/verification', data);
            return response;
        } catch (error) {
            return error.response.status;
        }
    }
};

export { Ticket }