import React, { useEffect, useRef } from 'react';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const VKIDComponent = () => {
  const containerRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const from = location.state?.from?.pathname || "/profile";
  console.log(from) //Для отладки

  useEffect(() => {
    const loadVKIDSDK = async () => {
      if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;

        const response = await axiosPrivate.get('/api/accounts/GetPKCE'); //Передать redirectionUrl сюда
        const { state, codeChallenge } = response.data;

        VKID.Config.init({
          app: 52743816,
          redirectUrl: 'https://petprotector.ru/api/accounts/CallbackVk',
          responseMode: VKID.ConfigResponseMode.Redirect,
          scope: 'email',
          state: state,
          codeChallenge: codeChallenge,
        });

        const oneTap = new VKID.OneTap();

        oneTap
          .render({
            container: containerRef.current,
            showAlternativeLogin: true,
            oauthList: ['ok_ru', 'mail_ru'],
          })
          .on(VKID.WidgetEvents.ERROR, vkidOnError)

        function vkidOnError(error) {
          console.error('Login error:', error);
          // Обработка ошибок
        }
      }
    };

    // Загружаем SDK VKID, если его ещё нет
    if (!window.VKIDSDK) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
      script.onload = loadVKIDSDK;
      document.body.appendChild(script);
    } else {
      loadVKIDSDK();
    }
  }, []);

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
};

export default VKIDComponent;
