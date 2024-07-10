import { t } from './i18n.js'
import '/src/components/gratitude.js'
import '/src/components/habits.js'
import '/src/components/icon.js'
import '/src/components/tasks.js'

const h1 = document.querySelector('h1')
let timeOfDay = new Date().getHours()

if (timeOfDay < 12) {
	timeOfDay = 'Morning'
} else if (timeOfDay < 18) {
	timeOfDay = 'Afternoon'
} else {
	timeOfDay = 'Evening'
}

h1.innerText = await t(`Good ${timeOfDay}, James`)

const p = document.querySelector('p')
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
		p.innerHTML = `${await t(quote)} - ${author}`
	})
