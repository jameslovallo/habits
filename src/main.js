import { t } from './i18n.js'
import '/src/components/gratitude.js'
import '/src/components/habits.js'
import '/src/components/icon.js'
import '/src/components/tasks.js'

const nav = document.querySelector('nav')

if (nav) {
	nav.innerHTML = /* html */ `
		<a href="/">
			<mdi-icon name="user"></mdi-icon>
			${await t('My Day')}
		</a>
		<a href="/friends.html">
			<mdi-icon name="group"></mdi-icon>
			${await t('Friends')}
		</a>
		<a href="/settings.html">
			<mdi-icon name="cog"></mdi-icon>
			${await t('Settings')}
		</a>
	`
}

const welcome = document.querySelector('#welcome')

if (welcome) {
	let timeOfDay = new Date().getHours()

	if (timeOfDay < 12) {
		timeOfDay = 'Morning'
	} else if (timeOfDay < 18) {
		timeOfDay = 'Afternoon'
	} else {
		timeOfDay = 'Evening'
	}

	welcome.innerText = await t(`Good ${timeOfDay}, James`)
}

const quotation = document.querySelector('#quotation')

if (quotation) {
	const getRandom = (min, max) => {
		const minCeiled = Math.ceil(min)
		const maxFloored = Math.floor(max)
		return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
	}

	fetch(
		'https://raw.githubusercontent.com/BennettElisa/black-women-inspire/main/quotes.json'
	)
		.then((res) => res.json())
		.then(async (json) => {
			const { quote, author } = json[getRandom(0, json.length - 1)]
			quotation.innerHTML = `${await t(quote)} - ${author}`
		})
}
