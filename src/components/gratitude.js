import { addRecord, date, deleteRecord, getRecords } from '../api.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev@1.0.29'
const table = 'Gratitude'

const heading = await t('Gratitude')
const placeholder = await t('What are you grateful for?')

const getList = async () => {
	const records = await getRecords({ table })
	records.forEach(({ id, fields: { Date } }, i) => {
		if (Date !== date()) {
			gratitude.splice(i, 1)
			deleteRecord({ table, id })
		}
	})
	return records
}

create('gratitude-list', {
	async template() {
		const records = await getList()
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
										@click="${() =>
											deleteRecord({
												table,
												id,
												callback: () => this.connectedCallback(),
											})}"
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
		[part='card'] {
			display: grid;
			padding: 0.5rem;
		}
		[part='text-input'] {
			margin: 0.5rem;
		}
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}
		ul:empty {
			display: none;
		}
		li {
			align-items: center;
			display: flex;
			gap: 0.5rem;
			padding-left: 0.5rem;
		}
		@keyframes spin {
			to {
				transform: rotate(-360deg);
			}
		}
		[name='sync'] {
			animation: spin 2s linear infinite;
		}
		[part='button'] {
			color: var(--red-300);
		}
		mdi-icon {
			pointer-events: none;
		}
	`,
})
