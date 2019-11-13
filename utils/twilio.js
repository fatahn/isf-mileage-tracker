// send SMS alert for maintenance
// FIX - NOT sending SMS 13/nov/2019
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

module.exports = (
	truckId,
	lastServicedMileage,
	lastServicedDate,
	alertMileage
) => {
	client.messages
		.create({
			body: `You have ${alertMileage}km to ${truckId}'s service.
					Last Serviced on ${lastServicedDate}, at ${lastServicedMileage} km`,
			from: process.env.SMS_SENDER_NUMBER,
			to: process.env.SMS_RECEIVER_NUMBER,
		})
		.then(message => console.log(message.sid))
}
