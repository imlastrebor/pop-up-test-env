//TVT Agent client

(function (d, t) {
  var v = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
  v.onload = function () {
    window.voiceflow.chat
      .load({
        verify: { projectID: '69299c5f93832ca5acea6c4f' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: 'https://runtime-api.voiceflow.com'
        },
        assistant: {
            persistence: 'localStorage'
        }
      })
      .then(() => {

        //Upseller analytics - note to allow domain in configs (voiceflow+vercel)
        window.loadUpsellerAnalytics({
          eventToken: 'tvt_prod_write_token_9K76F0B9-0D06-9G30-A3C6-91C4B1BD82Q9',
          projectID: '69299c5f93832ca5acea6c4f'
        });
        // Upseller Feedback UI - injects feedback UI into Voiceflow widget footer. Note: must be loaded after analytics.
        window.loadUpsellerFeedback({
          enableFallback: false
        });

        // First message after 2 seconds
        setTimeout(() => {
          window.voiceflow.chat.proactive.push({
            type: 'text',
            payload: {
              message: 'Tervetuloa! 👋 Olen Auli, TVT:n tekoälyllä toimiva avustaja.'
            }
          });
        }, 2000);
        // Second message after 8 seconds
        setTimeout(() => {
          window.voiceflow.chat.proactive.push({
            type: 'text',
            payload: {
              message: 'Haluatko apua asunnon hakemiseen tai asumiseen liittyvissä asioissa?'
            }
          });
        }, 8000);
      });
  };
  v.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
  v.type = 'text/javascript';
  s.parentNode.insertBefore(v, s);
})(document, 'script');
