import React, { useEffect, useRef } from 'react';

const VKIDComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadVKIDSDK = () => {
      if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;

        VKID.Config.init({
          app: 52743816,
          redirectUrl: 'https://patprotector.ru/api/users/vk-callback',
          responseMode: VKID.ConfigResponseMode.Callback, // Используем Callback
          source: VKID.ConfigSource.LOWCODE,
        });

        const oneTap = new VKID.OneTap();

        oneTap
          .render({
            container: containerRef.current,
            showAlternativeLogin: true,
            oauthList: ['ok_ru', 'mail_ru'], // Другие способы входа
          })
          .on(VKID.WidgetEvents.ERROR, handleError)
          .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (payload) => {
            const { code, device_id: deviceId } = payload;

            try {
              const tokenData = await VKID.Auth.exchangeCode(code, deviceId);

              if (tokenData) {
                console.log('Access token received:', tokenData);

                // Отправка токена на бэкенд
                const response = await fetch(
                  'https://patprotector.ru/api/users/create-user-vk',
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accessToken: tokenData.token }),
                  }
                );

                if (response.ok) {
                  const user = await response.json();
                  console.log('User saved:', user);
                } else {
                  console.error('Backend error:', await response.text());
                }
              }
            } catch (error) {
              console.error('Error exchanging code for token:', error);
            }
          });

        function handleError(error) {
          console.error('VKID error:', error);
        }
      }
    };

    // Загружаем SDK VKID, если он еще не загружен
    if (!window.VKIDSDK) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
      script.onload = loadVKIDSDK;
      document.body.appendChild(script);
    } else {
      loadVKIDSDK();
    }
  }, []);

  return <div ref={containerRef}></div>;
};

export default VKIDComponent;
