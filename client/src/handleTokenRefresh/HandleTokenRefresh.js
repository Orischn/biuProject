import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            const response = await api.post('/refresh');
            if (response.status !== 200) {
                localStorage.removeItem('accessToken');
                return response
            }
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            
            error.config.headers['Authorization'] = `Bearer ${accessToken}`;
            return api.request(error.config);
        }
        return error.response;
    }
);


export default api