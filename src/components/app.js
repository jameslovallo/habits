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

create('app', {
	page: 'home',
	record: '',
	async template({ record, page }) {
		return html`
			<nav>
				<button @click=${() => (this.page = 'home')}>
					<mdi-icon name="user"></mdi-icon>
					${await t('My Day')}
				</button>
				<button @click=${() => (this.page = 'friends')}>
					<mdi-icon name="group"></mdi-icon>
					${await t('Friends')}
				</button>
				<button @click=${() => (this.page = 'settings')}>
					<mdi-icon name="cog"></mdi-icon>
					${await t('Settings')}
				</button>
			</nav>
			<main>
				${page === 'home'
					? html`
							<h1>${await t(`Good ${timeOfDay}, ${Name}`)}</h1>
							<p>${await t(quote)} - ${author}</p>
							<header>
								<h2>${await t('Habits')}</h2>
								<button
									@click=${() => {
										this.record = ''
										setTimeout(() => (this.page = 'edit-habit'))
									}}
								>
									<mdi-icon name="plus"></mdi-icon>
								</button>
							</header>
							<c-habit></c-habit>
							<header>
								<h2>${await t('Tasks')}</h2>
							</header>
							<c-tasks></c-tasks>
							<header>
								<h2>${await t('Gratitude')}</h2>
							</header>
							<c-gratitude></c-gratitude>
					  `
					: ''}
				${page === 'edit-habit'
					? html`<edit-habit record=${record}></edit-habit>`
					: ''}
				${page === 'settings' ? html`<h1>${await t('Settings')}</h1>` : ''}
			</main>
		`
	},
	styles: css`
		nav {
			display: flex;
			filter: drop-shadow(1px 1px 1px black);
			padding: 0.5rem;
		}

		nav button {
			align-items: center;
			background: transparent;
			border: none;
			color: inherit;
			cursor: pointer;
			display: flex;
			gap: 0.5rem;
			padding: 0.5rem;
			text-decoration: none;
		}

		nav button:first-of-type {
			margin-right: auto;
		}

		nav button:hover,
		header button:hover {
			background: #0008;
			border-radius: 3rem;
		}

		main {
			max-width: 70ch;
			margin: 0 auto;
			padding: 2rem 1rem 4rem;
		}

		h1 {
			margin: 1rem 0;
		}

		h2 {
			margin: 0;
		}

		p {
			line-height: 1.75;
		}

		header {
			align-items: center;
			display: flex;
			justify-content: space-between;
			margin: 3rem 0 1rem;
		}

		header button {
			background: transparent;
			border: none;
			cursor: pointer;
			padding: 0.25rem;
		}

		*::part(card) {
			backdrop-filter: blur(5px);
			background: #000b;
			border-radius: var(--card-radius, 1.25rem);
			display: grid;
			gap: 0.5rem;
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
