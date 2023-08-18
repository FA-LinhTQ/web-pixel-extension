let NGROK_API = process.env.NGROK_URL;
let APP_API = process.env.APP_URL;
const LOCALSTORAGE_KEY = 'opx_event_track_'
const CONVERSION_API_PATH = '/api/store/conversions-api'
const PAYMENT_INFO_SUBMITTED = 'payment_info_submitted'
const EVENTS_TRACKING = [PAYMENT_INFO_SUBMITTED]

export {
	NGROK_API,
	APP_API,
	EVENTS_TRACKING,
	PAYMENT_INFO_SUBMITTED,
    LOCALSTORAGE_KEY,
	CONVERSION_API_PATH,
}