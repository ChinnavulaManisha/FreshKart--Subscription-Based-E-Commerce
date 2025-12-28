import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

instance.interceptors.request.use(
    (config) => {
        let user = null;
        try {
            const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Interceptor: Failed to parse user info:', error);
        }

        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto logout if 401 occurs
            localStorage.removeItem('userInfo');
            sessionStorage.removeItem('userInfo');
            // Redirect to login but usually we'd want to use window.location if not in a component
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login?redirect=' + window.location.pathname;
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
