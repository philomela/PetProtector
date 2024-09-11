import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true, //возможно убрать или вынести
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});