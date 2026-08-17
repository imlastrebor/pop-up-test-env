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

        // Heräte 1–3 proactive messages (URL-scoped)
        var popupButtons = [
          { text: 'Avaa keskustelu', name: 'open_chat', ariaLabel: 'Avaa keskustelu' },
          { text: 'Open conversation', name: 'open_chat_en', ariaLabel: 'Open conversation' }
        ];

        setTimeout(() => {
          // Heräte 1 – hakijat
          window.openUpsellerProactive({
            type: 'up_custom_simple',
            includes: [
              '/hakijalle/',
              '/kodit/'
            ],
            payload: {
              ariaLabel: 'Vuokra-asunnon haku',
              message:
                '<p>Hei! 👋 Haluatko vuokrata asunnon?</p>' +
                '<p>Etsitkö asuntoa tai kaipaatko apua asunnon hakemiseen?</p>' +
                '<p>Looking for an apartment – ask me a question.</p>',
              buttons: popupButtons
            }
          });
          // Heräte 2 – asukkaat ('/asukkaalle/' kattaa myös alasivut)
          window.openUpsellerProactive({
            type: 'up_custom_simple',
            includes: [
              '/asukkaalle/'
            ],
            payload: {
              ariaLabel: 'Apua asumiseen',
              message:
                '<p>Hei asukkaamme! 🙂</p>' +
                '<p>Kaipaatko apua kodin ja asumisen asioissa?</p>' +
                '<p>Do you need help with home and housing matters?</p>',
              buttons: popupButtons
            }
          });
          // Heräte 3 – yleinen, kaikki muut sivut (myös etusivu)
          window.openUpsellerProactive({
            type: 'up_custom_simple',
            excludes: [
              '/hakijalle/',
              '/kodit/',
              '/asukkaalle/'
            ],
            payload: {
              ariaLabel: 'TVT Asuntojen avustaja Auli',
              message:
                '<p>Hei!</p>' +
                '<p>Olen TVT Asuntojen tekoälyavustaja Auli.</p>' +
                '<p>Tarvitsetko apua? Kysy minulta – autan 24/7.</p>' +
                '<p>Do you need help? Ask me – I\'m here 24/7.</p>',
              buttons: popupButtons
            }
          });
        }, 2000);
      });
  };
  v.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
  v.type = 'text/javascript';
  s.parentNode.insertBefore(v, s);
})(document, 'script');
