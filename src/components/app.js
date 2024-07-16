import { getRecords } from '../api.js'
import quotes from '../data/quotes.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev'

const [
	{
		fields: { Name },
	},
] = await getRecords({ table: 'Settings' })

let timeOfDay = new Date().getHours()

if (timeOfDay < 12) {
	timeOfDay = 'Morning'
} else if (timeOfDay < 18) {
	timeOfDay = 'Afternoon'
} else {
	timeOfDay = 'Evening'
}

const getRandom = (min, max) => {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

const { quote, author } = quotes[getRandom(0, quotes.length - 1)]

create('c-app', {
	$page: 'home',
	setup({ shadowRoot, $page }) {
		this.changePage = (page, number) => {
			const main = shadowRoot.querySelector('main')
			$page.value = page
			main.scrollTo({
				left: main.clientWidth * number,
				behavior: 'smooth',
			})
		}
	},
	template: async ({ $page, changePage }) => html`
		<nav>
			<a
				@click=${(e) => {
					e.preventDefault()
					changePage('home', 0)
				}}
			>
				<mdi-icon name="user"></mdi-icon>
				${t('My Day')}
			</a>
			<a
				@click=${(e) => {
					e.preventDefault()
					changePage('friends', 1)
				}}
			>
				<mdi-icon name="group"></mdi-icon>
				${t('Friends')}
			</a>
			<a
				@click=${(e) => {
					e.preventDefault()
					changePage('settings', 2)
				}}
			>
				<mdi-icon name="cog"></mdi-icon>
				${t('Settings')}
			</a>
		</nav>
		<main>
			<div data-page="home" ?inert=${$page.value !== 'home'}>
				<h1>${await t(`Good ${timeOfDay}, ${Name}`)}</h1>
				<p>${await t(quote)} - ${author}</p>
				<habit-list></habit-list>
				<task-list></task-list>
				<gratitude-list></gratitude-list>
			</div>
			<div data-page="settings" ?inert=${$page.value !== 'settings'}>
				<h1>${await t('Settings')}</h1>
			</div>
		</main>
	`,
	styles: css`
		nav {
			display: flex;
			filter: drop-shadow(1px 1px 1px black);
			padding: 0.5rem;
		}

		nav a {
			align-items: center;
			color: inherit;
			cursor: pointer;
			display: flex;
			gap: 0.5rem;
			padding: 0.5rem;
			text-decoration: none;
		}

		nav a:first-of-type {
			margin-right: auto;
		}

		nav a:hover {
			background: #0008;
			border-radius: 3rem;
		}

		main {
			display: flex;
			scroll-snap-type: x mandatory;
			overflow-x: auto;
		}

		main > div {
			min-width: 100%;
			padding: 3rem max(calc((100vw - 70ch) / 2), 1rem);
		}

		h1 {
			margin: 0;
		}

		p {
			line-height: 1.75;
		}

		*::part(card) {
			backdrop-filter: blur(5px);
			background: #000b;
			border-radius: var(--card-radius, 1.25rem);
			display: grid;
			gap: 0.5rem;
			margin-bottom: 3rem;
			padding: 0.5rem;
		}

		*::part(button) {
			background: transparent;
			border: none;
			border-radius: 0.75rem;
			cursor: pointer;
			padding: 0.5rem;
		}

		*::part(button):hover {
			background: var(--soft-bg);
		}

		*::part(text-input) {
			background: transparent;
			border-radius: var(--card-child-radius, 0.5rem);
			border: 1px solid var(--soft-border);
			color: white;
			font: inherit;
			margin: 0.5rem;
			padding: 0.5rem;
		}

		*::part(text-input)::placeholder {
			color: var(--grey-400);
		}

		*::part(text-input):hover,
		*::part(text-input):focus {
			background: var(--soft-bg);
		}

		*::part(text-input):focus-visible {
			outline: 2px solid white;
		}
	`,
})
