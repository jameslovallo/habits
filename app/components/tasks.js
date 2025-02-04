import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'
import { t } from './translate.js'
import { create, css, html } from '//unpkg.com/cuick-dev'

const table = 'Tasks'

create('tasks', {
	async template() {
		const records = await getRecords({ table })
		const items = (status) => {
			const icon = ['moon', 'circle', 'check'][status]
			return records
				.filter(({ fields: { Status } }) => Status === status)
				.sort((a, b) => (a.fields.Name > b.fields.Name ? 1 : -1))
				.map(({ id, fields: { Name } }) => {
					return html`
						<li>
							${Name}
							<button
								part="button"
								data-status=${status}
								@click=${() => {
									const callback = () => this.connectedCallback()
									if (status === 2) {
										deleteRecord({ table, id, callback })
									} else {
										const Status = status + 1
										updateRecord({ table, id, fields: { Status }, callback })
									}
								}}
							>
								<c-icon name=${icon} />
								<c-icon name="trash" />
							</button>
						</li>
					`
				})
		}
		return html`
			<div part="card">
				<input
					part="text-input"
					placeholder=${await t('What do you need to do?')}
					@keydown=${({ key, target }) => {
						if (key === 'Enter') {
							addRecord({
								table,
								fields: { Name: target.value },
								callback: () => {
									target.blur()
									target.value = ''
									this.connectedCallback()
								},
							})
						}
					}}
				/>
				<ul data-count=${records.length}>
					${items(1)} ${items(0)} ${items(2)}
				</ul>
			</div>
		`
	},
	styles: css`
		ul {
			list-style: none;
			margin: 0;
			padding: 0 0 0 0.5rem;
		}
		[data-count='0'] {
			display: none;
		}
		li {
			align-items: center;
			display: flex;
			gap: 0.5rem;
			justify-content: space-between;
		}
		c-icon {
			color: var(--grey-400);
			pointer-events: none;
		}
		[name='moon'] {
			color: var(--blue-300);
		}
		[name='check'] {
			color: var(--green-300);
		}
		[name='trash'] {
			color: var(--red-300);
			display: none;
		}
		[data-status='2']:hover [name='check'] {
			display: none;
		}
		[data-status='2']:hover [name='trash'] {
			display: block;
		}
	`,
})
