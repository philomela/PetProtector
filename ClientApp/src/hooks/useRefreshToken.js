
import axios from '../api/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async (expiredToken) => {
        const response = await axios.post('/api/Accounts/RefreshToken', {
            withCredentials: true,
            token: expiredToken
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;