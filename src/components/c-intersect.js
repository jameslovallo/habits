customElements.define(
	'c-intersect',
	class extends HTMLElement {
		constructor() {
			const root = super()
			new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						root.dispatchEvent(new CustomEvent('intersect'))
					}
				})
			}).observe(root)
		}
	}
)
