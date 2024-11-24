import React, { useEffect, useRef } from 'react';
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const VKIDComponent = () => {
  const containerRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const loadVKIDSDK = () => {
      if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;

        VKID.Config.init({
          app: 52743816,
          redirectUrl: 'https://petprotector.ru/profile', // Укажите ваш redirectUrl
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: ['email']
        });

        const oneTap = new VKID.OneTap();

        oneTap
          .render({
            container: containerRef.current,
            showAlternativeLogin: true,
            oauthList: ['ok_ru', 'mail_ru'],
          })
          .on(VKID.WidgetEvents.ERROR, vkidOnError)
          .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
            const code = payload.code;
            const deviceId = payload.device_id;

            VKID.Auth.exchangeCode(code, deviceId)
              .then(vkidOnSuccess)
              .catch(vkidOnError);
          });

        function vkidOnSuccess(data) {
          console.log('Login successful:', data);

          // После успешного обмена на токен отправляем его на бэкенд
          const accessToken = data.token; // Токен, полученный от VKID SDK

           // Отправляем токен на сервер с использованием axios
           axiosPrivate
           .post('/api/users/LoginVk', 
             JSON.stringify({accessToken: accessToken})
           )
           .then(response => {
             console.log('User created or fetched:', response.data);
             // Здесь можно выполнить дополнительные действия, например, сохранить токен или выполнить редирект
           })
           .catch(error => {
             console.error('Error calling API:', error.response || error.message);
           });
        }

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
