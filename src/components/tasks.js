import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'

const table = 'Tasks'

customElements.define(
	'task-list',
	class extends HTMLElement {
		constructor() {
			const root = super().attachShadow({ mode: 'open' })
			root.innerHTML = `${this.html}<style>${this.css}</style>`

			this.renderTasks()

			root
				.querySelector('input')
				.addEventListener('keydown', (e) => this.addTask(e))
		}

		async renderTasks() {
			const tasks = await getRecords({ table })
			const filterAndSort = (status) =>
				tasks
					.filter(({ fields: { Name } }) => !!Name)
					.filter(({ fields: { Status } }) => Status === status)
					.sort((a, b) => (a.fields.Name > b.fields.Name ? 1 : -1))
			if (tasks) {
				this.list = this.shadowRoot.querySelector('ul')
				const sorted = [
					...filterAndSort(1),
					...filterAndSort(0),
					...filterAndSort(2),
				]
				this.list.innerHTML = sorted
					.map(
						({ id, fields: { Name, Status } }) => /* html */ `
							<li>
								${Name}
								<button data-id="${id}" data-status="${Status}" part="button">
									<mdi-icon
										name="${{ 0: 'moon', 1: 'circle', 2: 'check' }[Status]}"
									></mdi-icon>
									<mdi-icon name="trash"></mdi-icon>
								</button>
							</li>
						`
					)
					.join('')
				this.list.querySelectorAll('button').forEach((button) => {
					button.addEventListener('click', (e) => this.updateTask(e))
				})
			}
		}

		addTask({ key, target }) {
			const { value } = target
			if (key === 'Enter' && value) {
				target.value = ''
				addRecord(
					{
						table,
						fields: { Name: value, Status: 0 },
					},
					() => this.renderTasks()
				)
			}
		}

		updateTask(e) {
			let { id, status } = e.target.dataset
			status = Number(status)
			status === 2
				? deleteRecord({ table, id }, () => this.renderTasks())
				: updateRecord({ table, id, fields: { Status: status + 1 } }, () => {
						this.renderTasks()
				  })
		}

		html = /* html */ `
			<h2>Tasks</h2>
			<div part="card">
				<input part="text-input" type="text" placeholder="Add a task" />
				<ul>
					<li>
						<mdi-icon name="sync"></mdi-icon>
						Loading tasks
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
			button:hover {
				background: var(--button-bg-hover);
			}
			[name="moon"] {
				color: var(--blue-300);
			}
			[name="circle"] {
				color: var(--grey-400);
			}
			[name="check"] {
				color: var(--green-300);
			}
			[data-status="2"]:hover [name="check"] {
				display: none;
			}
			[name="trash"] {
				color: var(--red-300);
				display: none;
			}
			[data-status="2"]:hover [name="trash"] {
				display: block;
			}
		`
	}
)
