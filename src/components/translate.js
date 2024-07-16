import { t } from '../i18n.js'

customElements.define(
	'c-translate',
	class extends HTMLElement {
		async connectedCallback() {
			this.textContent = await t(this.textContent)
		}
	}
)
