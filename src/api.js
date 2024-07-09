const api = 'https://api.airtable.com/v0'

const defaults = { base: 'appRvQq0A7RzDTRkm' }

const token =
	'patEHgBf1N10JSmej.4aa1e42cfb5e2cd91abdb8d1b4e765aa57a7d37526cca8f663d7626f0976394e'

export const getRecords = (options) => {
	const { base, table } = { ...defaults, ...options }
	return fetch([api, base, table].join('/'), {
		headers: { Authorization: `Bearer ${token}` },
	})
		.then((r) => r.json())
		.then((r) => r.records)
}

export const getTable = (options) => {
	const { base, table } = { ...defaults, ...options }
	return fetch([api, 'meta/bases', base, 'tables'].join('/'), {
		headers: { Authorization: `Bearer ${token}` },
	})
		.then((r) => r.json())
		.then((r) => r.tables.find((t) => t.name === table))
}

export const addRecord = (options, callback) => {
	const { base, table, fields } = { ...defaults, ...options }
	fetch([api, base, table].join('/'), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ fields }),
	})
		.then((r) => r.json())
		.then((r) => callback(r))
}

export const deleteRecord = (options, callback) => {
	const { base, table, id } = { ...defaults, ...options }
	fetch([api, base, table, id].join('/'), {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
	})
		.then((r) => r.json())
		.then((r) => callback(r))
}

export const updateRecord = (options, callback) => {
	const { base, table, fields, id } = { ...defaults, ...options }
	fetch([api, base, table, id].join('/'), {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ fields }),
	})
		.then((r) => r.json())
		.then((r) => callback(r))
}

export const date = (d = new Date()) => {
	return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
