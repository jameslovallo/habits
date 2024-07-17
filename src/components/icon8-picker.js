import { default as merge } from 'https://esm.sh/deepmerge'
import { categories } from '../data/icons8.js'
import { t } from '../i18n.js'
import { create, css, html } from '//unpkg.com/cuick-dev'

const fetchIcons = async (category = 'alphabet', offset = 0) => {
	const url = 'https://api-icons.icons8.com'
	const endpoint = '/siteApi/icons/packs/demarcation'
	const params = {
		category,
		amount: 100,
		offset: offset * 100,
		platform: 'color',
		language: 'en-US',
	}
	const icons = await fetch(`${url}${endpoint}?${new URLSearchParams(params)}`)
		.then((res) => res.json())
		.then(({ category: { subcategory } }) => subcategory)

	return icons
}

create('icon8-picker', {
	// _editor: 'edit-habit',
	category: 'alphabet',
	setup() {
		this.icons = []
		this.offset = 0
		this.fetchIcons = async () => {
			this.icons = merge(
				this.icons,
				await fetchIcons(this.category, this.offset)
			)
			this.offset++
			this.connectedCallback()
		}
		this.fetchIcons()
	},
	async template() {
		return html`
			<h2>${await t('Browse Icons')}</h2>
			<div part="card">
				<select
					@change=${({ target }) => {
						this.category = target.value
						this.icons = []
						this.offset = 0
						this.fetchIcons()
					}}
				>
					${categories.map((c) => html`<option>${c}</option>`)}
				</select>
				<div part="categories">
					${this.icons.map((subcategory) => {
						const { name, icons } = subcategory
						return html`
							<h3><c-translate>${name}</c-translate></h3>
							<ul part="icons">
								${icons.map(({ id }) => {
									const url = `https://img.icons8.com/?size=128&id=${id}&format=png`
									return html`
										<li>
											<button
												part="button"
												@click=${() => (this._editor.icon = url)}
											>
												<img src=${url} />
											</button>
										</li>
									`
								})}
							</ul>
						`
					})}
				</div>
			</div>
			<c-intersect
				@intersect=${() => {
					this.fetchIcons()
				}}
			/>
		`
	},
	styles: css`
		select {
			background: var(--soft-bg);
			border-radius: 0.5rem;
			border: 1px solid var(--soft-border);
			margin: 0.5rem;
			padding: 0.5rem;
		}
		[part='categories'] {
			padding: 0.5rem;
		}
		h3 {
			text-transform: capitalize;
		}
		[part='icons'] {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
			list-style: none;
			margin: 0;
			padding: 0;
		}
		[part='icons'] button {
			border: 1px solid var(--soft-border);
			border-radius: 0.5rem;
			padding: 0.25rem;
		}
		[part='icons'] img {
			width: 100%;
		}
	`,
})
