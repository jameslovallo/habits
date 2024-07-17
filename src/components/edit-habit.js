import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev@1.0.29'

const table = 'Habits'
const addImageIcon = 'https://img.icons8.com/?size=100&id=11816&format=png'

create('edit-habit', {
	_app: 'c-app',
	record: '',
	name: '',
	link: '',
	icon: addImageIcon,
	async template({ record: id, icon, name, link, _app }) {
		let habit = {}
		if (id) {
			const habits = await getRecords({ table, id })
			habit = habits.find((x) => x.id === id).fields
			const { Icon, Name, Link } = habit
			if (Icon) this.icon = Icon
			if (Name) this.name = Name
			if (Link) this.link = Link
		} else {
			name = ''
			link = ''
		}
		return html`
			<h1>${await t(id ? 'Edit Habit' : 'Add Habit')}</h1>
			<div part="card">
				<form
					@submit=${(e) => {
						e.preventDefault()
						const fields = Object.fromEntries(new FormData(e.target).entries())
						fields.NumPerDay = Number(fields.NumPerDay)
						const callback = () => _app.changePage('home')
						id
							? updateRecord({ table, id, fields, callback })
							: addRecord({ table, fields, callback })
						app.changePage('home', 0)
					}}
				>
					<label>
						${await t('Name')}
						<input part="text-input" name="Name" value=${name} />
					</label>
					<div class="row">
						<label>
							${await t('Times per day')}
							<input
								part="text-input"
								name="NumPerDay"
								type="number"
								min="1"
								value=${habit.NumPerDay || 1}
							/>
						</label>
						<label style="flex-grow: 1">
							${await t('Link')}
							<input part="text-input" name="Link" value=${name} />
						</label>
					</div>
					<label>
						${await t('Icon')}
						<div class="row">
							<img src=${icon} />
							<input
								style="flex-grow: 1"
								part="text-input"
								name="Icon"
								value=${icon}
							/>
						</div>
					</label>
					<div class="row">
						<button part="button" type="submit" style="flex-grow: 1">
							${await t('Save')}
						</button>
						${id
							? html`
									<button
										part="button"
										@click=${() => {
											const callback = () => _app.changePage('home')
											deleteRecord({ table, id, callback })
										}}
									>
										<mdi-icon name="trash"></mdi-icon>
									</button>
							  `
							: ''}
					</div>
				</form>
			</div>
			<h2>${await t('Browse Icons')}</h2>
			<icon8-picker
				part="card"
				@select=${(e) => (this.icon = e.detail)}
			></icon8-picker>
		`
	},
	styles: css`
		* {
			box-sizing: border-box;
		}
		form {
			display: grid;
			gap: 1.5rem;
			padding: 0.5rem;
		}
		.row {
			align-items: center;
			display: flex;
			gap: 1rem;
		}
		label {
			display: grid;
			gap: 0.5rem;
			text-transform: capitalize;
		}
		input[part='text-input'] {
			margin: 0 !important;
			width: 100%;
		}
		img {
			height: 2rem;
			width: 2rem;
		}
		button[part='button'] {
			border: 1px solid var(--soft-border) !important;
			padding: 0.5rem;
		}
		[name='trash'] {
			color: var(--red-300);
		}
		h2 {
			margin-top: 3rem;
		}
	`,
})
