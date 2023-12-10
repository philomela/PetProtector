import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
    const [userInfo, setUserInfo] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserProfile = async () => {
            try {
                const response = await axiosPrivate.get('/api/users/UserInfo', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUserInfo(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        const getUserCollar = async () => {
            try {
                const response = await axiosPrivate.get('/api/users/UserInfo', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUserInfo(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUserProfile();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <article>
            <h2>Профиль</h2>
            {userInfo && (
                <>
                    <p>Ваше имя: {userInfo.fullName}</p>
                    <p>Ваш email: {userInfo.email}</p>
                    <p>Дата регистрации: {userInfo.createdAt}</p>
                </>
            )}
             <h3>Ваши браслеты:</h3>
             
        </article>
    );
};

export default Profile;