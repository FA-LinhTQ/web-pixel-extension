import { 
    APP_API,
    EVENT_TRACKING,
	CHECKOUT_STARTED,
	PAYMENT_INFO_SUBMITTED,
	CHECKOUT_COMPLETED,
	LOCALSTORAGE_KEY,
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
let checkoutData = {}
let eventId = ''

let checkoutStarted = () => {
    let payload = {
        content_ids: contentIds,
        content_type: 'product_group',
        contents,
        currency,
        value: totalItemsValue,
        num_items: quantity,
    }
    sendBeacon('InitiateCheckout', eventId, payload);
}

let paymentSubmited = () => {
    let payload = {
        content_category: 'paymentSubmitted',
        content_ids: contentIds,
        contents,
        currency,
        value: totalItemsValue,
    }
    sendBeacon('AddPaymentInfo', eventId, payload);
}

let checkoutCompleted = () => {
    // set event to localStorage -> Theme App Extension will get event and track in browser
    let localStorageKey = LOCALSTORAGE_KEY + eventName;
    let payload = {
        name: eventName,
        eventId,
        data: eventData.data,
    }
    wokerBrowser.localStorage.setItem(localStorageKey, JSON.stringify(payload));
}

let updateData = () => {
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
    checkoutData = event.data.checkout;
    eventId = event.id
    updateData();

    switch (eventName) {
        case PAYMENT_INFO_SUBMITTED:
            paymentSubmited()
            break;
    }
}
