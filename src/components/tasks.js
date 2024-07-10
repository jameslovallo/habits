import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev@1.0.29'

const table = 'Tasks'

const heading = await t('Tasks')
const placeholder = await t('What do you need to do?')

create('task-list', {
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
								<mdi-icon name=${icon}></mdi-icon>
								<mdi-icon name="trash"></mdi-icon>
							</button>
						</li>
					`
				})
		}
		return html`
			<h2>${heading}</h2>
			<div part="card">
				<input
					part="text-input"
					placeholder=${placeholder}
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
		mdi-icon {
			pointer-events: none;
		}
		[name='moon'] {
			color: var(--blue-300);
		}
		[name='circle'] {
			color: var(--grey-400);
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
