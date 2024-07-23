import translate from '//unpkg.com/translate'

const { language } = navigator

export const t = (text) =>
	!language.startsWith('en') ? translate(text, language.split('-')[0]) : text

customElements.define(
	'c-t',
	class extends HTMLElement {
		async connectedCallback() {
			this.textContent = await t(this.textContent)
		}
	}
)
