Two separate setups: classic sites use the first tab; React, Vue, Next.js client navigations, etc. use the second. Direct links: #proactive-popup-standard · #proactive-popup-spa-case

How it works
URL checks first (if any URL filters are set): evaluation order is exclude_exact -> include_exact -> includes -> excludes.
Voiceflow proactive API: the function calls voiceflow.chat.proactive.push() to add a proactive message.
Shadow DOM: the script waits for the proactive card in the widget’s shadow root, then injects your HTML/CSS and optional image/buttons.
Floating mode only: proactive popups are not supported in embedded mode.
Main parameters
Parameter	Description
type	'text' (plain text) or 'up_custom_simple' (HTML + optional image/buttons). Lowercase.
payload	Content: message, optional image (filename in /clients/), optional buttons array, optional cssclass. For a11y/localisation: optional ariaLabel, imageAlt, buttonsGroupLabel; buttons support ariaLabel. See “Overriding labels and accessibility” below.
exclude_exact	Do not show if full URL (window.location.href) exactly equals this value (or any in array). Strict match.
include_exact	Show only if full URL exactly equals this value (or any in array). Strict match.
includes	Show only if URL contains this string (or any string in array). Optional.
excludes	Do not show if URL contains this string (or any in array). Optional. Evaluated after include_exact and includes.
cssURL	Optional custom CSS URL; default uses dist/popup.css from base URL.
dismiss	Optional dismiss mapping for stack close X. Use { id: 'popup-1', scope: 'session' }; scope defaults to session. Also supports shorthand 'popup-1'. If configured, closed popup id is suppressed once per scope.
Template types
text – Plain text only. No HTML, no image, no buttons.
up_custom_simple – Custom HTML in payload.message, optional payload.image (filename in clients/), optional payload.buttons (array of { text, name? }). Use payload.cssclass for custom styling. Image is rendered above message; buttons below.
Custom CSS class: If you use cssclass and style the popup with your own CSS, you must define assistant.stylesheet in Voiceflow chat.load() so that your stylesheet is loaded into the widget (e.g. voiceflow.chat.load({ assistant: { stylesheet: 'https://.../clients/your-client.css' } })).

Button behaviour
For up_custom_simple, each button can have text (label) and optional name (Voiceflow event name; use underscores, e.g. existing_customer). On click: chat opens, Voiceflow event is triggered if name is set, and analytics event proactive_clicked is sent.

Dismiss / show once behavior
If you set dismiss, closing proactive stack with X stores dismiss ids and suppresses those popups for the selected scope. Because X closes the whole stack, all active dismiss ids in the stack are marked dismissed at that moment.

dismiss: { id: 'popup-1' } → default scope session (same tab session)
dismiss: { id: 'popup-1', scope: 'local' } → persists in localStorage
dismiss: 'popup-1' → shorthand for session scope
window.openUpsellerProactive({
  type: 'up_custom_simple',
  dismiss: { id: 'pricing-popup', scope: 'session' },
  payload: {
    message: '<p>Need help choosing a plan?</p>',
    buttons: [{ text: 'Chat', name: 'pricing_help' }]
  }
});
Overriding labels and accessibility
Accessibility (roles, ARIA attributes, labels) follows W3C WCAG 2.1 (Level A/AA where applicable) and W3C ARIA in HTML. Defaults are in Finnish. Override via payload (and per-button ariaLabel) for localisation or screen readers. All optional.

payload.ariaLabel – Dialog name for assistive tech. Default: Viesti.
payload.imageAlt – Image alt text. Default: logo.
payload.buttonsGroupLabel – Label for the button group. Default: Toiminnot.
payload.buttons[].ariaLabel – Per-button accessible name. Default: button text.
window.openUpsellerProactive({
  type: 'up_custom_simple',
  payload: {
    message: '<p>Need help?</p>',
    ariaLabel: 'Help offer',
    imageAlt: 'Company logo',
    buttonsGroupLabel: 'Options',
    buttons: [
      { text: 'Chat', name: 'open_chat', ariaLabel: 'Open chat' }
    ]
  }
});
Example variations
1. Simple text

window.openUpsellerProactive({
  type: 'text',
  payload: { message: 'Hello! This is a proactive message.' }
});
2. Custom HTML + image + buttons

window.openUpsellerProactive({
  type: 'up_custom_simple',
  payload: {
    message: '<p><b>Welcome!</b> How can we help?</p>',
    image: 'logo.png',
    cssclass: 'my-card',
    buttons: [
      { text: 'New customer', name: 'new_customer' },
      { text: 'Existing customer', name: 'existing_customer' },
      { text: 'Just browsing' }
    ]
  }
});
3. URL condition: show only on certain pages (includes)

window.openUpsellerProactive({
  type: 'up_custom_simple',
  includes: '/demo/',
  payload: { message: '<p>Demo page – need help?</p>', buttons: [{ text: 'Chat', name: 'help' }] }
});
4. URL exclusion: do not show on checkout (excludes)

window.openUpsellerProactive({
  type: 'up_custom_simple',
  excludes: '/checkout',
  payload: { message: '<p>Need help?</p>', buttons: [{ text: 'Yes', name: 'need_help' }] }
});
5. Exact full-URL match with include_exact / exclude_exact

window.openUpsellerProactive({
  type: 'up_custom_simple',
  include_exact: 'https://www.example.com/pricing?plan=pro',
  exclude_exact: 'https://www.example.com/pricing?plan=pro&preview=true',
  payload: { message: '<p>Need help with this exact page?</p>' }
});
6. Combine includes and excludes

window.openUpsellerProactive({
  type: 'up_custom_simple',
  includes: '/product/',
  excludes: '/sale/',
  payload: { message: '<p>Questions about this product?</p>', buttons: [...] }
});
7. Clear existing proactive messages before showing a new one

window.voiceflow.chat.proactive.clear();
setTimeout(function() {
  window.openUpsellerProactive({ type: 'up_custom_simple', payload: { message: '<p>New message.</p>' } });
}, 100);
Integration in config
Call openUpsellerProactive inside voiceflow.chat.load({...}).then(...), usually after a short delay (e.g. 500 ms) so the widget is ready. You can call it multiple times with different delays to stack several proactive cards.

window.voiceflow.chat.load({ verify: { projectID: '...' }, ... }).then(function() {
  setTimeout(function() {
    window.openUpsellerProactive({ type: 'text', payload: { message: 'First message' } });
  }, 500);
  setTimeout(function() {
    window.openUpsellerProactive({ type: 'up_custom_simple', payload: { message: '<p>Second card</p>', buttons: [...] } });
  }, 1000);
});