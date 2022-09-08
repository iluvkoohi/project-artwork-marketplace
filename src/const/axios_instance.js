import axios from "axios";
import { baseUrl } from "./url";

const ArtworkMpClient = axios.create({
    baseURL: baseUrl,
    timeout: 9000,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});

export default ArtworkMpClient;