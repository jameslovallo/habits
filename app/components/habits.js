import { date, getRecords, updateRecord } from '../api.js'
import { create, css, html } from '//unpkg.com/cuick-dev'

const table = 'Habits'

const getList = async () => {
	const records = await getRecords({ table })
	records.forEach(({ id, fields: { LastUpdated, Negative } }, i) => {
		if (LastUpdated !== date()) {
			records[i].fields.LastUpdated = date()
			records[i].fields.DoneToday = Negative ? 1 : 0
			updateRecord({ table, id, fields: records[i].fields })
		}
	})
	return records
}

create('habits', {
	_app: 'c-app',
	async template({ _app }) {
		const habits = await getList()
		return html`
			<ul part="card">
				${habits
					.sort((a, b) =>
						a.fields.Name.toLowerCase() > b.fields.Name.toLowerCase() ? 1 : -1
					)
					.map(
						({
							id,
							fields: { Icon, Name, Link, NumPerDay, DoneToday, Negative },
						}) => {
							const done = DoneToday === NumPerDay
							let icon
							if (done) {
								icon = 'check'
							} else if (DoneToday === 0) {
								icon = Negative ? 'cancel' : 'circle'
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
										<button
											part="text"
											@click=${() => {
												_app.record = id
												setTimeout(() => (_app.page = 'edit-habit'))
											}}
										>
											${Name}
											<small><c-t>Today</c-t>: ${DoneToday}/${NumPerDay}</small>
										</button>
									</div>
									<button
										part="action"
										@click=${() => {
											DoneToday = done ? 0 : DoneToday + 1
											const callback = () => this.connectedCallback()
											updateRecord({
												table,
												id,
												fields: { DoneToday },
												callback,
											})
										}}
									>
										<c-icon name=${icon} />
									</button>
								</li>
							`
						}
					)}
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
			background: transparent;
			border: none;
			color: inherit;
			display: grid;
			gap: 0.25rem;
			text-align: left;
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
		[part='action']:hover {
			background: var(--soft-bg);
		}
		c-icon {
			color: var(--grey-400);
			pointer-events: none;
		}
		[name='check'] {
			color: var(--green-300);
		}
		[name='checkProgress'] {
			color: var(--yellow-300);
		}
		[name='cancel'] {
			color: var(--red-300);
		}
	`,
})
