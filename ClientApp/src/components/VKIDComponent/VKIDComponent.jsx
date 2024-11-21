import React, { useEffect, useRef } from 'react';

const VKIDComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadVKIDSDK = () => {
      if ('VKIDSDK' in window) {
        const VKID = window.VKIDSDK;

        VKID.Config.init({
          app: 52743816,
          redirectUrl: 'https://patprotector.ru/api/vk-callback',
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
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
          // Обработка успешного входа
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
