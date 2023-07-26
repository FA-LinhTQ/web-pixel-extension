import { 
	PAYMENT_INFO_SUBMITTED,
    CONVERSION_API_PATH,
 } from './variables'

let eventName = ''
let eventData = {}
let rawDomain = ''
let wokerBrowser = {}
let sourceUrl = ''
let contentIds = []
let quantity = 0
let contents = []
let totalItemsValue = 0
let currency = ''

let paymentSubmited = (eventId) => {
    let payload = {
        content_ids: contentIds,
        contents,
        currency,
        value: totalItemsValue,
    }
    sendBeacon('AddPaymentInfo', eventId, payload);
}

let updateData = (checkoutData) => {
    checkoutData.lineItems.forEach(item => {
        contentIds.push(item.variant.id)
        quantity = quantity + item.quantity
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
        event_source_url: sourceUrl,
        social_type: 'facebook'
    }
    wokerBrowser.sendBeacon('https://ef50-42-96-52-2.ngrok-free.app' + CONVERSION_API_PATH, JSON.stringify(payload))
}

export default function (browser, event, domain) {
    eventName = event.name
    eventData = event
    rawDomain = domain
    wokerBrowser = browser
    sourceUrl = event.context.document.location.href
    updateData(event.data.checkout);

    switch (eventName) {
        case PAYMENT_INFO_SUBMITTED:
            paymentSubmited(event.id)
            break;
    }
}
