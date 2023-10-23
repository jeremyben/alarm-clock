import Store from 'electron-store'
import { Alarm } from '../interfaces'
import { handleInvoke, handleSendSync } from './ipc-methods'

const store = new Store<{ alarms: Alarm[] }>({
	name: 'alarm',
	clearInvalidConfig: true,
	schema: {
		alarms: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					hour: { type: 'number' },
					minute: { type: 'number' },
				},
				required: ['hour', 'minute'],
			},
		},
	},
	defaults: {
		alarms: [],
	},
})

export function listAlarms(): Alarm[] {
	return store.get('alarms')
}

export function handleAlarmRendererEvents() {
	handleSendSync('list-alarms', listAlarms)

	handleInvoke('create-alarm', (newAlarm) => {
		console.log('create-alarm event:', newAlarm)

		const alarms = listAlarms()
		const alreadyExists = alarms.some((al) => al.hour === newAlarm.hour && al.minute === newAlarm.minute)

		if (alreadyExists) {
			return { ok: false, error: 'Alarme existe déjà' }
		}

		alarms.push(newAlarm)

		try {
			store.set('alarms', alarms)
			return { ok: true, value: alarms }
		} catch (error) {
			// todo: mieux gérer les erreurs venues de la validation du store.
			return { ok: false, error: String(error) }
		}
	})

	handleInvoke('remove-alarm', (alarmToRemove) => {
		console.log('remove-alarm event:', alarmToRemove)

		const alarms = listAlarms()
		const alarmFoundIndex = alarms.findIndex(
			(al) => al.hour === alarmToRemove.hour && al.minute === alarmToRemove.minute
		)

		if (alarmFoundIndex >= 0) {
			alarms.splice(alarmFoundIndex, 1)
			store.set('alarms', alarms)
			return { ok: true, value: alarms }
		} else {
			return { ok: false, error: 'Alarme à supprimer non trouvée' }
		}
	})
}
