import axios from "axios";

const ArtworkMpClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 9000,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});

export default ArtworkMpClient;