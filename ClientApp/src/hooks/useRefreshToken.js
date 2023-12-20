
import axios from '../api/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async (expiredToken) => {
        const response = await axios.post('/api/accounts/refreshToken', {
            token: expiredToken
        });
        setAuth({ ...auth, accessToken: response.data.token });
        return response.data.token;
    }
    return refresh;
};

export default useRefreshToken;