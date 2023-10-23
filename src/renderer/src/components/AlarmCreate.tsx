import React, { useEffect, useState } from 'react'
import { Alarm } from 'src/interfaces'

function AlarmCreate(props: { onCreate: (newAlarm: Alarm) => Promise<boolean> }): JSX.Element {
	const [time, setTime] = useState('')
	const [creating, setCreating] = useState(false)

	const submit: React.FormEventHandler = (ev) => {
		ev.preventDefault()

		if (!time) {
			alert('Missing time input')
			return
		}

		setCreating(true)

		const [hourStr, minuteStr] = time.split(':')

		const hour = Number.parseInt(hourStr)
		const minute = Number.parseInt(minuteStr)

		if (Number.isNaN(hour)) {
			alert('Hour has wrong format')
			return
		}

		if (Number.isNaN(minute)) {
			alert('Minute has wrong format')
			return
		}

		props
			.onCreate({ hour, minute })
			.then((ok) => {
				if (ok) setTime('')
			})
			.finally(() => {
				setCreating(false)
			})
	}

	return (
		<form onSubmit={submit}>
			<input type="time" name="time" required value={time} onChange={(ev) => setTime(ev.target.value)} />
			<button type="submit" aria-busy={creating} disabled={creating}>
				Save
			</button>
		</form>
	)
}

export default AlarmCreate
