const puppeteer = require('puppeteer')

const pollMileage = require('./utils/poll')

require('dotenv').config()
;(async () => {
	let pollTimer
	let truckNotice
	try {
		const browser = await puppeteer.launch({ headless: false })
		const page = await browser.newPage()
		await page.goto('https://google.com')
		await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

		console.log('waiting for input tag:,')

		page.waitForSelector('input', { visible: true }).then(() => {
			await page.type('input[id=username]', process.env.USERNAME, {
				delay: 20,
			})
			await page.type('input[id=password]', process.env.PASSWORD, {
				delay: 20,
			})
			await page.click('input[value="Log On"]', { delay: 100 })
		})

		// poll at reasonable intervals
		pollTimer = setInterval(pollMileage, 60000)
	} catch (error) {
		clearInterval(pollTimer)
		console.log('Puppeteer Error: ', error)
		browser.close()
	}
})()
