import { addRecord, date, deleteRecord, getRecords } from '../api.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev'

const table = 'Gratitude'
const heading = await t('Gratitude')
const placeholder = await t('What are you grateful for?')

const getList = async () => {
	const records = await getRecords({ table })
	records.forEach(({ id, fields: { Date } }, i) => {
		if (Date !== date()) {
			records.splice(i, 1)
			deleteRecord({ table, id })
		}
	})
	return records
}

create('gratitude-list', {
	async template() {
		const records = await getList()
		return html`
			<div part="card">
				<input
					part="text-input"
					placeholder=${placeholder}
					@keydown=${({ key, target }) => {
						if (key === 'Enter') {
							addRecord({
								table,
								fields: { Date: date(), Name: target.value },
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
					${records
						.filter(({ fields: { Name } }) => !!Name)
						.sort((a, b) => (a.fields.Name > b.fields.Name ? 1 : -1))
						.map(
							({ id, fields: { Name } }) => html`
								<li>
									${Name}
									<button
										part="button"
										@click=${() =>
											deleteRecord({
												table,
												id,
												callback: () => this.connectedCallback(),
											})}
									>
										<mdi-icon name="trash"></mdi-icon>
									</button>
								</li>
							`
						)}
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
		[part='button'] {
			color: var(--red-300);
		}
		mdi-icon {
			pointer-events: none;
		}
	`,
})
