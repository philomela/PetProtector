import axios from '../api/axios';
import { useEffect, useState } from 'react';

const usePublicAxios = () => {
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                // Вы можете добавить любую кастомную логику, если необходимо
                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            error => {
                if (error?.response?.status === 500) {
                    setErrorMessage("Что-то пошло не так. Попробуйте позже.");
                } else if (error?.response?.status === 404) {
                    setErrorMessage("Ресурс не найден.");
                } else if (error?.response?.status === 400) {
                    setErrorMessage("Некорректный запрос.");
                } else if (!error.response) {
                    setErrorMessage("Сетевая ошибка. Проверьте подключение к интернету.");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        };
    }, []);

    return { axios, errorMessage, setErrorMessage };
};

export default usePublicAxios;
