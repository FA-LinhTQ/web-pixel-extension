import {register} from "@shopify/web-pixels-extension";
import facebookPixelScript from './js/facebook-pixel-script.js'
import tiktokPixelScript from './js/tiktok-pixel-script.js'
import {
    APP_API,
    EVENTS_TRACKING,
} from './js/variables.js'

let listFacebookPixel = []
let listTikTokPixel = []

console.log('%c' + '77777777777777',  'color: red; font-weight: bold; font-size: 20px; padding: 4px');

register(({ analytics, browser, settings, init }) => {
    analytics.subscribe('all_standard_events', event => {
        if (EVENTS_TRACKING.includes(event.name)) {
            
            console.log('%coutput', 'color: green; font-weight: bold; font-size: 20px;', event);

            fetch(APP_API + `/api/store/pixel?shop=` + settings.accountID)
                .then(response => response.json())
                .then(res => {
                    if(res.data && res.data.length > 0) {
                        res.data.forEach(pixel => {
                            pixel.social_type === 'facebook' ? listFacebookPixel.push(pixel) : null
                            pixel.social_type === 'tiktok' ? listTikTokPixel.push(pixel) : null
                        })
                        if (listFacebookPixel.length > 0) {
                            facebookPixelScript(browser, event, settings.accountID)
                        }
                        if (listTikTokPixel.length > 0) {
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

