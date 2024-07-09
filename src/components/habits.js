import { date, getRecords, updateRecord } from '../api.js'

const table = 'Habits'

customElements.define(
	'habit-list',
	class extends HTMLElement {
		constructor() {
			const root = super().attachShadow({ mode: 'open' })
			root.innerHTML = `${this.html}<style>${this.css}</style>`
			this.renderList()
		}

		async renderList() {
			const habits = await getRecords({ table })
			if (habits) {
				habits.forEach(({ id, fields: { LastUpdated } }, i) => {
					if (LastUpdated !== date()) {
						habits[i].fields.LastUpdated = date()
						habits[i].fields.LinkClicked = false
						habits[i].fields.DoneToday = 0
						updateRecord({ table, id, fields: habits[i].fields })
					}
				})
				this.list = this.shadowRoot.querySelector('ul')
				this.list.innerHTML = habits
					.filter(({ fields: { Name } }) => !!Name)
					.sort((a, b) => (a.fields.Name > b.fields.Name ? 1 : -1))
					.map(
						({
							id,
							fields: { Name, Icon, NumPerDay, DoneToday, Link, LinkClicked },
						}) => /* html */ `
							<li part="habit">
								<a href="/edit-habit?id=${id}" part="habit-link">
									<img src="${Icon}">
									<div>
										<div part="name">${Name}</div>
										<small part="details">
											Today: ${DoneToday} / ${NumPerDay}
										</small>
									</div>
								</a>
								${
									Link && !LinkClicked
										? /* html */ `
											<a href="${Link}" part="action" data-id="${id}" target="_blank">
												<mdi-icon name="open"></mdi-icon>
											</a>
										`
										: /* html */ `
											<button
												part="action"
												data-id="${id}"
												data-num="${NumPerDay}"
												data-done="${DoneToday}"
											>
												<mdi-icon
													name="${DoneToday === NumPerDay ? 'check' : 'circle'}"
												></mdi-icon>
											</button>
										`
								}
							</li>
						`
					)
					.join('')
			}

			this.list.querySelectorAll('button').forEach((button) => {
				button.addEventListener('click', ({ target }) => {
					let { id, num, done } = target.dataset
					num = Number(num)
					done = Number(done)
					if (done < num) {
						updateRecord(
							{
								table,
								id,
								fields: { DoneToday: Number(done) + 1 },
							},
							() => this.renderList()
						)
					} else {
						updateRecord(
							{
								table,
								id,
								fields: { DoneToday: 0, LinkClicked: false },
							},
							() => this.renderList()
						)
					}
				})
			})

			this.list.querySelectorAll('a').forEach((a) => {
				a.addEventListener('click', ({ target }) => {
					updateRecord(
						{
							table,
							id: target.dataset.id,
							fields: { LinkClicked: true },
						},
						() => this.renderList()
					)
				})
			})
		}

		html = /* html */ `
			<div part="heading">
				<h2>Habits</h2>
				<a href="/edit-habit" part="button" title="Add habit">
					<mdi-icon name="plus"></mdi-icon>
				</a>
			</div>
			<ul part="card">
				<li>
					Loading habits
					<mdi-icon name="sync"></mdi-icon>
				</li>
			</ul>
		`

		css = /* css */ `
			* {
				box-sizing: border-box;
			}
			[part="heading"] {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}
			[part="button"] {
				color: white;
			}
			ul {
				display: grid;
				gap: 0.5rem;
				grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
				list-style: none;
				margin: 0;
				padding: 0.5rem;
			}
			[part="habit"] {
				align-items: center;
				border: 1px solid #5555;
				border-radius: var(--card-child-radius, 0.75rem);
				display: grid;
				grid-template-columns: 1fr auto;
				overflow: hidden;
			}
			[part="habit-link"] {
				align-items: center;
				color: var(--grey-400);
				display: grid;
				gap: 0.5rem;
				grid-template-columns: 2.75rem 1fr;
				padding: 0.5rem;
				text-decoration: none;
			}
			img {
				aspect-ratio: 1;
				max-width: 100%;
			}
			[part="name"] {
				font-size: 14px;
			}
			[part="details"] {
				color: var(--grey-400);
				font-size: 12px;
			}
			[part="action"] {
				align-items: center;
				background: none;
				border: none;
				color: var(--grey-400);
				cursor: pointer;
				display: flex;
				height: 100%;
				padding: 0.5rem;
			}
			[part="action"]:hover,
			[part="action"]:focus {
				background: #5555;
			}
			[name="check"] {
				color: var(--green-300);
			}
		`
	}
)
