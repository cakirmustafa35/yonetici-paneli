import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for debugging



export default api;

