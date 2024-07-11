import { date, getRecords, updateRecord } from '../api.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev@1.0.29'

const table = 'Habits'
const heading = await t('Habits')
const today = await t('Today')

const getList = async () => {
	const records = await getRecords({ table })
	records.forEach(({ id, fields: { LastUpdated } }, i) => {
		if (LastUpdated !== date()) {
			records[i].fields.LastUpdated = date()
			records[i].fields.DoneToday = 0
			updateRecord({ table, id, fields: records[i].fields })
		}
	})
	return records
}

create('habit-list', {
	async template() {
		const habits = await getList()
		return html`
			<header>
				<h2>${heading}</h2>
				<a href="/edit-habit.html" part="button">
					<mdi-icon name="plus"></mdi-icon>
				</a>
			</header>
			<ul part="card">
				${habits
					.sort((a, b) =>
						a.fields.Name.toLowerCase() > b.fields.Name.toLowerCase() ? 1 : -1
					)
					.map(({ id, fields: { Icon, Name, Link, NumPerDay, DoneToday } }) => {
						const done = DoneToday === NumPerDay
						let icon
						if (done) {
							icon = 'check'
						} else if (DoneToday === 0) {
							icon = 'circle'
						} else if (DoneToday < NumPerDay) {
							icon = 'checkProgress'
						}
						return html`
							<li>
								<div part="content">
									${Link
										? html`
												<a href=${Link} target="_blank">
													<img src=${Icon} />
												</a>
										  `
										: html`<img src=${Icon} />`}
									<a part="text" href=${`/edit-habit.html?id=${id}`}>
										${Name}
										<small>${today}: ${DoneToday}/${NumPerDay}</small>
									</a>
								</div>
								<button
									part="action"
									@click=${() => {
										DoneToday = done ? 0 : DoneToday + 1
										const callback = () => this.connectedCallback()
										updateRecord({ table, id, fields: { DoneToday }, callback })
									}}
								>
									<mdi-icon name=${icon}></mdi-icon>
								</button>
							</li>
						`
					})}
			</ul>
		`
	},
	styles: css`
		header {
			align-items: center;
			display: flex;
			justify-content: space-between;
		}
		header [part='button'],
		header mdi-icon {
			color: inherit;
		}
		ul {
			display: grid;
			gap: 0.5rem;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			list-style: none;
			margin: 0;
			padding: 0 0 0 0.5rem;
		}
		li {
			align-items: center;
			border: 1px solid var(--soft-border);
			border-radius: 0.75rem;
			display: flex;
			justify-content: space-between;
		}
		[part='content'] {
			align-items: center;
			color: inherit;
			display: grid;
			flex-grow: 1;
			grid-template-columns: 2.75rem 1fr;
			gap: 0.5rem;
			padding: 0.5rem;
			text-decoration: none;
		}
		[part='text'] {
			color: inherit;
			display: grid;
			gap: 0.25rem;
			text-decoration: none;
		}
		small {
			color: var(--grey-400);
			font-family: monospace;
			font-size: 0.75rem;
		}
		[part='action'] {
			align-items: center;
			background: transparent;
			border: none;
			border-top-right-radius: 0.75rem;
			border-bottom-right-radius: 0.75rem;
			display: flex;
			height: 100%;
			padding: 0.5rem;
		}
		button:hover {
			background: var(--soft-bg);
		}
		mdi-icon {
			color: var(--grey-400);
			pointer-events: none;
		}
		[name='check'] {
			color: var(--green-300);
		}
		[name='checkProgress'] {
			color: var(--yellow-300);
		}
	`,
})
