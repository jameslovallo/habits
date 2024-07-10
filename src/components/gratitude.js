import { addRecord, date, deleteRecord, getRecords } from '../api.js'

const table = 'Gratitude'

customElements.define(
	'gratitude-list',
	class extends HTMLElement {
		constructor() {
			const root = super().attachShadow({ mode: 'open' })
			root.innerHTML = `${this.html}<style>${this.css}</style>`

			this.renderList()

			root
				.querySelector('input')
				.addEventListener('keydown', (e) => this.addGratitude(e))
		}

		async renderList() {
			const gratitude = await getRecords({ table })
			if (gratitude) {
				gratitude.forEach(({ id, fields: { Date } }, i) => {
					if (Date !== date()) {
						gratitude.splice(i, 1)
						deleteRecord({ table, id })
					}
				})
				this.list = this.shadowRoot.querySelector('ul')
				this.list.innerHTML = gratitude
					.filter(({ fields: { Name } }) => !!Name)
					.sort((a, b) => (a.fields.Name > b.fields.Name ? 1 : -1))
					.map(
						({ id, fields: { Name } }) => /* html */ `
							<li>
								${Name}
								<button data-id="${id}" part="button">
									<mdi-icon name="trash"></mdi-icon>
								</button>
							</li>
						`
					)
					.join('')
				this.list.querySelectorAll('button').forEach((button) => {
					button.addEventListener('click', (e) => {
						const { id } = e.target.dataset
						deleteRecord({ table, id }, () => this.renderList())
					})
				})
			}
		}

		addGratitude({ key, target }) {
			const { value } = target
			if (key === 'Enter' && value) {
				target.value = ''
				addRecord({ table, fields: { Name: value, Date: date() } }, () =>
					this.renderList()
				)
			}
		}

		html = /* html */ `
			<h2>Gratitude</h2>
			<div part="card">
				<input part="text-input" type="text" placeholder="What are you grateful for?" />
				<ul>
					<li>
						<mdi-icon name="sync"></mdi-icon>
						Loading journal
					</li>
				</ul>
			</div>
		`

		css = /* css */ `
			[part="card"] {
				display: grid;
				gap: 0.5rem;
				padding: 0.5rem;
			}
			[part="text-input"] {
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
				to { transform: rotate(-360deg) }
			}
			[name="sync"] {
				animation: spin 2s linear infinite;
			}
			[part="button"] {
				color: var(--red-300);
			}
			mdi-icon {
				pointer-events: none;
			}
		`
	}
)
