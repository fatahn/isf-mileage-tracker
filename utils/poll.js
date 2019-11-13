const sendAlert = require('./utils/twilio')
const lastServiced = require('./lastServiceData')[0]
const moment = require('moment')

require('dotenv').config()

const pollMileage = async () => {
	try {
		const trucksData = await page.evaluate(() => {
			let trucks = []
			// get the truck elements
			let elements = document.querySelectorAll('div.unit')
			// get the truck data
			elements.forEach(element => {
				let unitDetails = {}
				const truckId = element
					.querySelector('span.unit-name')
					.innerText.replace(/\s|Interstate/g, '')
				const currentMileage = element
					.querySelector('div.odo')
					.innerText.replace(/\s|km/g, '')

				unitDetails.truckId = truckId
				unitDetails.mileage = currentMileage
				const diff = Number(currentMileage) - Number(lastServiced.mileage)
				const alertThreshold = Number(process.env.SERVICE_ALERT_THRESHOLD)

				trucks.push(unitDetails)
				if (diff <= alertThreshold) {
					truckNotice = unitDetails
				}
			})
			return trucks
		})
		const currentTime = moment().format('DD/MM/YYYY h:mm')
		const { truckId, mileage } = trucksData[0]
		console.log(
			`TRUCK: ${truckId}, MILEAGE at ${currentTime}: ${mileage}KM`
			// last serviced: ${lastServiced[0].time}
		)
		sendAlert(
			truckNotice.truckId,
			'lastServiced.mileage', // FIX change from string
			'lastServiced.date', // FIX change from string
			1
		)
	} catch (error) {
		console.log('Error: ', error)
	}
}

module.exports = pollMileage
