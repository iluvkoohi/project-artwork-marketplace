import ArtworkMpClient from "../const/axios_instance";

class Art {
    async create(data) {
        try {
            const response = await ArtworkMpClient.post('/api/art', data);
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }
    async update(data) {
        try {
            const response = await ArtworkMpClient.put('/api/art/update', data);
            return response;
        } catch (error) {
            console.log(error)
            if (error.response.status == 400) return 400;
            return 500;
        }
    }

    async delete(id) {
        try {
            const response = await ArtworkMpClient.delete(`/api/art/${id}`);
            return response;
        } catch (error) {
            console.log(error)
            if (error.response.status == 400) return 400;
            return 500;
        }
    }
    async getByArtists(query) {
        try {
            const response = await ArtworkMpClient.get('/api/arts/by-artists', { params: query });
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }

    async getNearbyArts(query) {
        try {
            const response = await ArtworkMpClient.get('/api/arts', { params: query });
            return response;
        } catch (error) {
            if (error.response.status == 400) return 400;
            return 500;
        }
    }

}

export { Art }