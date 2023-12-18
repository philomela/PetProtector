import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Questionnaire = () => {
  const { id } = useParams();

  const [questionnaireInfo, setQuestionnaireInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getQuestionnaireInfo = async () => {
      try {
        //Вынести вызов незащищенного апи в отдельный сервис
        const response = await axios.get(`https://localhost:7100/api/Questionnaries/${id}`, {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setQuestionnaireInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getQuestionnaireInfo();

    return () => {
      isMounted = false;
      controller.abort();
    };

  }, []);

  return (
    <div>
      {questionnaireInfo ? (
        <div>
          <h1>{questionnaireInfo.phoneNumber}</h1>
          <p>{questionnaireInfo.ownersName}</p>
          <p>{questionnaireInfo.petsName}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};


export default Questionnaire;