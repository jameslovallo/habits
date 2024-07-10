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
			habits[i].fields.LastUpdated = date()
			habits[i].fields.LinkClicked = false
			habits[i].fields.DoneToday = 0
			updateRecord({ table, id, fields: habits[i].fields })
		}
	})
	return records
}

create('habit-list', {
	async template() {
		const habits = await getList()
		return html`
			<h2>${heading}</h2>
			<ul part="card">
				${habits
					.sort((a, b) => (a.fields.Name > b.fields.Name ? 1 : -1))
					.map(({ id, fields: { Icon, Name, Link, NumPerDay, DoneToday } }) => {
						const done = DoneToday === NumPerDay
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
									<mdi-icon name=${done ? 'check' : 'circle'}></mdi-icon>
								</button>
							</li>
						`
					})}
			</ul>
		`
	},
	styles: css`
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
			pointer-events: none;
		}
		[name='circle'] {
			color: var(--grey-400);
		}
		[name='check'] {
			color: var(--green-300);
		}
	`,
})
