import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SearchForm from "../../components/SearchForm/SearchForm";

const Profile = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [searchCollarsInfo, setSearchCollarsInfo] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchInfo = (collar) => setSearchCollarsInfo(collar);

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
  }, []);

  return (
    <article>
      <h2>Профиль</h2>
      {profileInfo && (
        <>
          <p>Ваше имя: {profileInfo.fullName}</p>
          <p>Ваш email: {profileInfo.email}</p>
          <p>Дата регистрации: {profileInfo.createdAt}</p>
        </>
      )}
      <h3>Поиск браслета:</h3>
      {<SearchForm handleSearchInfo={handleSearchInfo} />}
      {searchCollarsInfo && (
        <>
          <h3>Найденные браслеты:</h3>
          <p>{searchCollarsInfo}</p>
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
    </article>
  );
};

export default Profile;
