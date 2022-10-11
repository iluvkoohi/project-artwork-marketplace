import axios from "axios";

const ArtworkMpClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    //timeout: 9000,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    onUploadProgress: (progressEvent) => {
        console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total));
    }
});



export default ArtworkMpClient;