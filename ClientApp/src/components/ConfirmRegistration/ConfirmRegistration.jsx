
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ConfirmRegistration = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const Confirm = async () => {
      try {
        const confirmRegistrationResponse = await axios.put("/api/users/ConfirmRegister", {
          UserId: userId
        });
        
        if (confirmRegistrationResponse.status === 200) {
          navigate("/login", true)
        } else {
          navigate("/", true)
        }

      } catch (err) {
        console.error(err);
      }
    };

    Confirm();

    return () => {
      //controller.abort();
    };
  }, []);
};

export default ConfirmRegistration;
