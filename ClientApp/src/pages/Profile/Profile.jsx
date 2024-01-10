import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SearchForm from "../../components/SearchForm/SearchForm";
import Preloader from "../../components/Preloader/Preloader";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState(null);
  const [searchCollarsInfo, setSearchCollarsInfo] = useState(null);
  const [searchedCollar, setSearchedCollar] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchInfo = async (collar) => setSearchCollarsInfo(collar);

  const handleLinkCollar = async () => {
    try {
      // Отправка данных на сервер
      const response = await axiosPrivate.put(`/api/collars/${searchCollarsInfo}`, {
      });
  
      // Обновление компонента после успешного запроса
      setSearchedCollar(response);
  
      // Сброс информации о поиске
      setSearchCollarsInfo(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserProfile = async () => {
      try {
        const responseUserInfo = await axiosPrivate.get("/api/users/UserInfo", {
          signal: controller.signal,
        });
        const responseUserCollars = await axiosPrivate.get(
          "/api/collars/GetAll",
          {
            signal: controller.signal,
          }
        );
        console.log(responseUserInfo.data);
        console.log(responseUserCollars.data);
        isMounted &&
          setProfileInfo({
            ...responseUserInfo.data,
            ...responseUserCollars.data,
          });
        setIsLoading(false); 
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUserProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchedCollar]);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <section className={styles.profile_section}>
        <h2>Профиль</h2>
          {profileInfo && (
            <>
            <h3>Инфо:</h3>
            <FontAwesomeIcon className={styles.user_icon} icon={faUser} />
              <p>Ваше имя: {profileInfo.fullName}</p>
              <p>Ваш email: {profileInfo.email}</p>
              <p>Дата регистрации: {profileInfo.createdAt}</p>
            </>
          )}
          <h3>Поиск браслета:</h3>
          <SearchForm handleSearchInfo={handleSearchInfo} />
          {searchCollarsInfo && (
            <>
              <h3>Браслет найден:</h3>
              <p>{searchCollarsInfo}</p>
              <button onClick={handleLinkCollar}>Активировать</button>
            </>
          )}
          <h3>Ваши браслеты:</h3>
          {profileInfo && (
            <>
              {profileInfo.collars.map((collar) => (
                <div key={collar.id}>
                  <p>
                    Владелец животного:{" "}
                    {collar.questionnaire.ownersName ?? "Еще не заполнено"}
                  </p>
                  <p>
                    Имя животного:{" "}
                    {collar.questionnaire.petsName ?? "Еще не заполнено"}
                  </p>
                  <p>
                    Телефон владельца:{" "}
                    {collar.questionnaire.phoneNumber ?? "Еще не заполнено"}
                  </p>
                </div>
              ))}
            </>
          )}
        </section>
      )}
    
    </>
  );
};

export default Profile;