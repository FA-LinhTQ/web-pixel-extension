import {register} from "@shopify/web-pixels-extension";
import facebookPixelScript from './js/facebook-pixel-script.js'
import tiktokPixelScript from './js/tiktok-pixel-script.js'
import {APP_API, EVENTS_TRACKING} from './js/variables.js'

let existFacebookPixel = false
let existTiktokPixel = false

console.log('%c' + 'Web pixel final 61',  'color: red; font-weight: bold; font-size: 20px; padding: 4px');

register(({ analytics, browser, settings, init }) => {
    analytics.subscribe('all_standard_events', event => {
        if (EVENTS_TRACKING.includes(event.name)) {
            fetch(APP_API + `/api/store/pixel?shop=` + settings.accountID)
                .then(response => response.json())
                .then(res => {
                    if(res.data && res.data.length > 0) {
                        res.data.forEach(pixel => {
                            pixel.social_type === 'facebook' ? existFacebookPixel = true : null
                            pixel.social_type === 'tiktok' ? existTiktokPixel = true : null
                        })
                        if (existFacebookPixel) {
                            facebookPixelScript(browser, event, settings.accountID)
                        }
                        if (existTiktokPixel) {
                            tiktokPixelScript(browser, event, settings.accountID)
                        }
                    } else {
                        console.log('empty pixels');
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    })
    console.log('web pixel loaded');
});

