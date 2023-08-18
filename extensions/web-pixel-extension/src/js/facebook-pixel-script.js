import {PAYMENT_INFO_SUBMITTED, CONVERSION_API_PATH, NGROK_API} from './variables'

let eventData = {}
let rawDomain = ''
let wokerBrowser = {}
let variantIds = []
let productIds = []
let contents = []
let totalItemsValue = 0
let currency = ''

let paymentSubmited = (eventId) => {
    let payload = {
        content_ids: variantIds,
        variant_id: variantIds,
        product_id: productIds,
        contents,
        currency,
        value: totalItemsValue,
    }
    sendBeacon('AddPaymentInfo', eventId, payload);
}

let updateData = (checkoutData) => {
    checkoutData.lineItems.forEach(item => {
        variantIds.push(item.variant.id)
        productIds.push(item.variant.product.id)
        contents.push({
            id: item.variant.id,
            quantity: item.quantity,
        })
    })
    currency = checkoutData.currencyCode
    totalItemsValue = parseFloat(checkoutData.totalPrice.amount);
}

let sendBeacon = (eventName, eventId, eventPayload) => {
    let payload = {
        shop: rawDomain,
        event_name: eventName,
        event_time: new Date().getTime(),
        event_id: eventId,
        action_source: 'website',
        custom_data: eventPayload,
        event_source_url: eventData.context.document.location.href,
        social_type: 'facebook'
    }
    wokerBrowser.sendBeacon(NGROK_API + CONVERSION_API_PATH, JSON.stringify(payload))
}

export default function (browser, event, domain) {
    try {
        eventData = event
        rawDomain = domain
        wokerBrowser = browser
        updateData(event.data.checkout);
        switch (event.name) {
            case PAYMENT_INFO_SUBMITTED:
                paymentSubmited(event.id)
                break;
        }
    } catch(error) {
        console.log(error)
    }
}
