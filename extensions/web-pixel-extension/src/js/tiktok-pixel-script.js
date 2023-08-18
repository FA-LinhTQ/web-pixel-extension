import {PAYMENT_INFO_SUBMITTED, CONVERSION_API_PATH, NGROK_API} from './variables'

let eventData = {}
let rawDomain = ''
let wokerBrowser = {}
let listVariantItems = []
let listProductItems = []
let totalItemsValue = 0
let currency = ''

let paymentSubmited = (eventId) => {
    let payload = {
        contents: listVariantItems,
        variant_id: listVariantItems,
        product_id: listProductItems,
        currency,
        value: totalItemsValue,
    }
    sendBeacon('AddPaymentInfo', eventId, payload);
}

let updateData = (checkoutData) => {
    checkoutData.lineItems.forEach(item => {
        listVariantItems.push({
            id: item.variant.id,
            quantity: item.quantity,
        })
        listProductItems.push({
            id: item.variant.product.id,
            quantity: item.quantity,
        })
    })
    currency = checkoutData.currencyCode
    totalItemsValue = parseFloat(checkoutData.totalPrice.amount);
}

let sendBeacon = (eventName, eventId, eventPayload) => {
    let payload = {
        shop: rawDomain,
        event: eventName,
        timestamp: new Date().toISOString(),
        event_id: eventId,
        properties: eventPayload,
        event_source_url: eventData.context.document.location.href,
        social_type: 'tiktok',
        context: {
            page: {
                url: eventData.context.document.location.href,
                referrer: eventData.context.document.location.origin
            }
        }
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
