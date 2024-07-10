import translate from '//unpkg.com/translate'

const { language } = navigator
export const t = (text) =>
	!language.startsWith('en') ? translate(text, language.split('-')[0]) : text
