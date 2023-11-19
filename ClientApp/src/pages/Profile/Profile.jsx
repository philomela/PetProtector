import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();

      const getQuestionnaire = async () => {
          try {
              const response = await axiosPrivate.post('/api/user/getUserInfo', {
                  signal: controller.signal
              });
              console.log(response.data);
              isMounted && setUsers(response.data);
          } catch (err) {
              console.error(err);
              navigate('/login', { state: { from: location }, replace: true });
          }
      }

      getQuestionnaire();

      return () => {
          isMounted = false;
          controller.abort();
      }
  }, [])

  return (
      <article>
          <h2>Users List</h2>
          {users?.length
              ? (
                  <ul>
                      {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                  </ul>
              ) : <p>No users to display</p>
          }
      </article>
  );
};

export default Profile;