import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'

const table = 'Habits'

const id = new URLSearchParams(location.search).get('id')
let habit = {}

if (id) {
	const habits = await getRecords({ table, id })
	habit = habits.find((x) => x.id === id).fields
}

customElements.define(
	'edit-habit',
	class extends HTMLElement {
		constructor() {
			const root = super().attachShadow({ mode: 'open' })
			const { Name, Icon, NumPerDay, Link } = habit

			root.innerHTML = /* html */ `
				<h1>${id ? 'Edit Habit' : 'Add Habit'}</h1>

				<form part="card">
					<label>
						Name
						<input
							part="text-input"
							name="Name"
							value="${Name || ''}"
						/>
					</label>
					<div class="row">
						<label>
							Times per day
							<input
								part="text-input"
								name="NumPerDay"
								type="number"
								min="1"
								value="${NumPerDay || 1}"
								style="width: 6rem;"
							/>
						</label>
						<label style="flex-grow: 1;">
							Link
							<input
								part="text-input"
								name="Link"
								value="${Link || ''}" 
							/>
						</label>
					</div>
					<label>
						Icon
						<div class="row icon">
							<img src="${Icon || 'https://img.icons8.com/?size=100&id=11816&format=png'}" />
							<input
								part="text-input"
								name="Icon"
								value="${Icon || ''}"
								style="flex-grow: 1"
							/>
						</div>
					</label>
					<div class="row">
						<button part="button" type="submit">Save</button>
						${
							id
								? /* html */ `
									<button part="button" id="delete-button">
										<mdi-icon name="trash"></mdi-icon>
									</button>
								`
								: ''
						}
					</div>
				</form>

				<h2>Browse Icons</h2>

				<div part="card">
					<select id="category-changer">
						<option>alphabet</option>
						<option>animals</option>
						<option>arrows</option>
						<option>business</option>
						<option>cinema</option>
						<option>data</option>
						<option>emoji</option>
						<option>finance</option>
						<option>flags</option>
						<option>food</option>
						<option>gaming</option>
						<option>hands</option>
						<option>healthcare</option>
						<option>holidays</option>
						<option>household</option>
						<option>logos</option>
						<option>messaging</option>
						<option>mobile</option>
						<option>music</option>
						<option>plants</option>
						<option>profile</option>
						<option>programming</option>
						<option>shopping</option>
						<option>social-networks</option>
						<option>sports</option>
						<option>symbols</option>
						<option>time-and-date</option>
						<option>users</option>
						<option>weather</option>
					</select>
					
					<div id="icons"></div>
					
					<div id="loader"></div>
				</div>

				<style>
					* {
						box-sizing: border-box;
					}
					h2 {
						margin-top: 3rem;
						text-transform: capitalize;
					}
					[part="card"] {
						display: grid;
						padding: 1rem;
					}
					form {
						gap: 1rem;
					}
					label {
						display: grid;
						gap: 0.5rem;
					}
					.row {
						display: flex;
						gap: 1rem;
					}
					img {
						height: 2.25rem;
						width: 2.25rem;
					}
					[part="button"] {
						border: 1px solid var(--soft-border) !important;
						font: inherit;
						line-height: 1.5rem;
						margin-left: 0 !important;
					}
					[type="submit"] {
						flex-grow: 1;
					}
					#delete-button {
						color: var(--red-300);
					}
					.grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
						gap: 1rem;
					}
					select {
						background: var(--soft-bg);
						border: 1px solid var(--soft-border);
						border-radius: 0.5rem;
						padding: 0.5rem;
					}
					button {
						background: transparent;
						border: none;
						cursor: pointer;
						padding: 0;
					}
					button img {
						width: 100%;
					}
				</style>
			`

			// form

			this.form = root.querySelector('form')
			this.form.addEventListener('submit', (e) => {
				e.preventDefault()
				const fields = Object.fromEntries(new FormData(this.form).entries())
				fields.NumPerDay = Number(fields.NumPerDay)
				const callback = () => (location.href = '/')
				id
					? updateRecord({ table, id, fields }, callback)
					: addRecord({ table, fields }, callback)
			})

			// delete button

			if (id) {
				this.deleteButton = root.querySelector('#delete-button')
				this.deleteButton.addEventListener('click', (e) => {
					e.preventDefault()
					deleteRecord({ table, id })
					location.href = '/'
				})
			}

			// icon picker

			this.iconImg = root.querySelector('.icon img')
			this.iconInput = root.querySelector('.icon input')
			this.categorySelect = root.querySelector('#category-changer')
			this.resultContainer = root.querySelector('#icons')
			this.loader = root.querySelector('#loader')

			this.iconInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					this.iconImg.src = this.iconInput.value
				}
			})

			new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.useApi(this.config)
						this.config.params.offset += 100
					}
				})
			}).observe(this.loader)

			this.categorySelect.addEventListener('change', (e) => {
				this.config.params.category = e.target.value
				this.config.params.offset = 0
				this.resultContainer.innerHTML = ''
			})

			window.addEventListener('icon-click', ({ detail }) => {
				this.iconImg.src = detail
				this.iconInput.value = detail
			})
		}

		useApi({ url, endpoint, params, format, callback }) {
			params = Object.keys(params)
				.map((p) => `${p}=${params[p]}`)
				.join('&')
			fetch(`${url}${endpoint || ''}?${params}`)
				.then((res) => res[format]())
				.then((res) => callback(res))
		}

		config = {
			url: 'https://api-icons.icons8.com',
			endpoint: '/siteApi/icons/packs/demarcation',
			params: {
				category: 'alphabet',
				amount: 100,
				offset: 0,
				platform: 'color',
				language: 'en-US',
			},
			format: 'json',
			callback: (res) => this.renderIcons(res),
		}

		renderIcons(res) {
			const {
				category: { subcategory },
			} = res
			subcategory.forEach(({ name, icons }) => {
				let categoryContainer = this.shadowRoot.querySelector(
					`[data-category="${name}"]`
				)
				if (!categoryContainer) {
					this.resultContainer.innerHTML += /* html */ `
						<h3>${name}</h3>
						<div class="grid" data-category="${name}"></div>
					`
					categoryContainer = this.shadowRoot.querySelector(
						`[data-category="${name}"]`
					)
				}
				categoryContainer.innerHTML += icons
					.map(({ id }) => {
						const iconUrl = `https://img.icons8.com/?size=128&id=${id}&format=png`
						return /* html */ `
								<button
									onclick="window.dispatchEvent(new CustomEvent('icon-click', { detail: '${iconUrl}' }))"
								>
									<img src="${iconUrl}" />
								</button>
						`
					})
					.join('')
			})
		}
	}
)
