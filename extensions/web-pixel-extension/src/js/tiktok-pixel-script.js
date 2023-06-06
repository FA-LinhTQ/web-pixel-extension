import { createId, sendConversion } from './helper.js'

let eventId = createId()
let tag = []
let collection = []

export default function(event, settings) {
    let payload = {
        shop: settings.accountID,
        event_name: event.name,
        event_time: new Date().getTime(),
        event_id: eventId,
        action_source: 'website',
        custom_data: {name: 'Linh', age: 24},
        tag: tag,
        event_source_url: event.context.document.location.href,
        collection: collection,
        social_type: 'facebook'
    }
    let originDomain = event.context.document.location.origin 
	// let domain = `${originDomain}/apps/sohead-pixel-local`
    sendConversion(payload)
}
