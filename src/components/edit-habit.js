import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev@1.0.29'

const table = 'Habits'
const addImageIcon = 'https://img.icons8.com/?size=100&id=11816&format=png'

create('edit-habit', {
	_app: 'c-app',
	record: '',
	icon: addImageIcon,
	async template({ record, icon }) {
		this.habit = {}
		if (record) {
			const habits = await getRecords({ table, record })
			this.habit = habits.find((x) => x.id === record).fields
		}
		const { id, Name, Icon, Link, NumPerDay } = this.habit
		const callback = () => {
			_app.changePage('home')
			_app.record = ''
		}
		return html`
			<h1>${await t(id ? 'Edit Habit' : 'Add Habit')}</h1>
			<div part="card">
				<form
					@submit=${(e) => {
						e.preventDefault()
						const fields = Object.fromEntries(new FormData(e.target).entries())
						fields.NumPerDay = Number(fields.NumPerDay)
						id
							? updateRecord({ table, id, fields, callback })
							: addRecord({ table, fields, callback })
					}}
				>
					<label>
						${await t('Name')}
						<input part="text-input" name="Name" value=${Name} />
					</label>
					<div class="row">
						<label>
							${await t('Times per day')}
							<input
								part="text-input"
								name="NumPerDay"
								type="number"
								min="1"
								value=${NumPerDay || 1}
							/>
						</label>
						<label style="flex-grow: 1">
							${await t('Link')}
							<input part="text-input" name="Link" value=${Link} />
						</label>
					</div>
					<label>
						${await t('Icon')}
						<div class="row">
							<img src=${Icon || addImageIcon} />
							<input
								style="flex-grow: 1"
								part="text-input"
								name="Icon"
								value=${Icon || addImageIcon}
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
