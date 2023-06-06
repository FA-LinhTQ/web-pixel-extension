function createId() {
	var text = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
	}
	return (
		text() +
		text() +
		'' +
		text() +
		'' +
		text() +
		'' +
		text() +
		'' +
		text() +
		text() +
		text()
	)
}

function sendConversion(payload) {
    fetch('https://92c2-113-161-32-170.ngrok-free.app/api/store/conversions-api', {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(payload)
    })
	.then(response => response.json())
	.then(res => {
		if(!res.status) {
			console.log(res.message)
		}
	})
    .catch(err => console.log(err))
}
export {
	createId,
	sendConversion
}