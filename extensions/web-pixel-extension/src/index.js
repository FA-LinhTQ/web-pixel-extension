import {register} from "@shopify/web-pixels-extension";
import facebookPixelScript from './js/facebook-pixel-script.js'

let listFacebookPixel = []

register(({ analytics, browser, settings }) => {
    analytics.subscribe('all_events', event => {
        console.log('event', event);
        fetch(process.env.API_URL +  `/api/store/pixel?shop=makima-3.myshopify.com`)
            .then(response => response.json())
            .then(res => {
                if(res.data && res.data.length > 0) {
                    res.data.forEach(pixel => {
                        pixel.social_type === 'facebook' ? listFacebookPixel.push(pixel) : null
                    })
                }
                if (listFacebookPixel.length > 0) {
                    facebookPixelScript(event, settings);
                }
                console.log('%c' + 'Web pixel loaded', 'color: blue; font-weight: bold; font-size: 20px; padding: 4px');
            })
            .catch(err => {
                console.log(err);
        })
    });
});

