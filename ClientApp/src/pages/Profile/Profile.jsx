import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SearchForm from "../../components/SearchForm/SearchForm";
import Preloader from "../../components/Preloader/Preloader";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import styles from "./Profile.module.css";

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
      const response = await axiosPrivate.put(
        `/api/collars/${searchCollarsInfo}`,
        {}
      );

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
        <>
        <Box>

        </Box>
          <section className={styles.first_section}>
            <section className={styles.user_info_section}>
              {profileInfo && (
                <div className={styles.user_info}>
                  <div className={styles.user_info_title_block}>
                    <h2 className={styles.user_info_title}>Ваш профиль</h2>{" "}
                  </div>
                  <div className={styles.user_info_data_block}>
                    <p>Ваше имя: {profileInfo.fullName}</p>
                    <p>Ваш email: {profileInfo.email}</p>
                    <p>Дата регистрации: {profileInfo.createdAt}</p>
                    <Avatar
                      sx={{ bgcolor: deepOrange[500], width: 76, height: 76 }}
                    >
                      N
                    </Avatar>
                  </div>
                </div>
              )}
            </section>
            <section className={styles.searh_section}>
              <div className={styles.search_collar}>
                <h2>Поиск браслета</h2>
                <SearchForm handleSearchInfo={handleSearchInfo} />
                {searchCollarsInfo && (
                  <>
                    <h3>Браслет найден:</h3>
                    <p>{searchCollarsInfo}</p>
                    <Button
                      onClick={handleLinkCollar}
                      variant="contained"
                      sx={{ bgcolor: "#1f5d6d" }}
                    >
                      Активировать
                    </Button>
                  </>
                )}
              </div>
            </section>
          </section>
          <section className={styles.second_section}>
            <section className={styles.collars_section}>
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
          </section>
        </>
      )}
    </>
  );
};

export default Profile;
