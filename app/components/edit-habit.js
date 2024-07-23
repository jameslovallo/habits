import { addRecord, deleteRecord, getRecords, updateRecord } from '../api.js'
import { create, css, html } from '//unpkg.com/cuick-dev@1.0.29'

const table = 'Habits'
const addImageIcon = 'https://img.icons8.com/?size=100&id=11816&format=png'

create('edit-habit', {
	_app: 'c-app',
	record: '',
	icon: '',
	async template({ record, icon, _app }) {
		this.habit = { Icon: addImageIcon }
		if (record) {
			const habits = await getRecords({ table, record })
			this.habit = habits.find((x) => x.id === record).fields
		}
		const { id, Name, Icon, Link, NumPerDay } = this.habit
		const callback = () => {
			_app.page = 'home'
			_app.record = ''
		}
		return html`
			<h1><c-t>${id ? 'Edit Habit' : 'Add Habit'}</c-t></h1>
			<div part="card">
				<form
					@submit=${(e) => {
						e.preventDefault()
						const fields = Object.fromEntries(new FormData(e.target).entries())
						fields.NumPerDay = Number(fields.NumPerDay)
						id && fields.Name
							? updateRecord({ table, id, fields, callback })
							: addRecord({ table, fields, callback })
					}}
				>
					<label>
						<c-t>Name</c-t>
						<input part="text-input" name="Name" value=${Name} />
					</label>
					<div class="row">
						<label>
							<c-t>Time per day</c-t>
							<input
								part="text-input"
								name="NumPerDay"
								type="number"
								min="1"
								value=${NumPerDay || 1}
							/>
						</label>
						<label style="flex-grow: 1">
							<c-t>Link</c-t>
							<input part="text-input" name="Link" value=${Link} />
						</label>
					</div>
					<label>
						<c-t>Icon</c-t>
						<div class="row">
							<img src=${icon || Icon} />
							<input
								style="flex-grow: 1"
								part="text-input"
								name="Icon"
								value=${icon || Icon}
							/>
						</div>
					</label>
					<div class="row">
						<button part="button" type="submit" style="flex-grow: 1">
							<c-t>Save</c-t>
						</button>
						${record
							? html`
									<button
										part="button"
										@click=${(e) => {
											e.preventDefault()
											deleteRecord({ table, id: record, callback })
										}}
									>
										<c-icon name="trash" />
									</button>
							  `
							: ''}
					</div>
				</form>
			</div>
			<h2><c-t>Browse Icons</c-t></h2>
			<icon8-picker part="card" @select=${(e) => (this.icon = e.detail)} />
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
