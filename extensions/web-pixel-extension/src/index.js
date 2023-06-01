import {register} from "@shopify/web-pixels-extension";

register(({ configuration, analytics, browser }) => { 
  
    analytics.subscribe('all_events', (event) => {
      console.log('Event', event);

      var data = {
        event_name: event.name,
        data: event.data
      }

      browser.sendBeacon('https://cb82-113-161-32-170.ngrok-free.app/api/list-event', JSON.stringify(data));
    });
    console.log('%c' + 'new code ne', 'color: blue; font-weight: bold; font-size: 20px; padding: 4px');

});
