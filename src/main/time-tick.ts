import { BrowserWindow } from 'electron'
import { sendToRenderer } from './ipc-methods'
import { listAlarms } from './alarms'
import { Alarm } from '../interfaces'

export function handleTimeTickEvents(win: BrowserWindow) {
	tick(win)
	const intervalId = setInterval(() => tick(win), 1000)

	win.on('close', () => clearInterval(intervalId))
}

// State mémoire pour éviter de faire sonner la même alarme à chaque seconde.
let ringingAlarm: Alarm | null = null

function tick(win: BrowserWindow) {
	const now = new Date()

	// On envoie directement l'heure au renderer avant de passer au calcul de l'alarme.
	sendToRenderer(win, 'time-tick', now.toLocaleTimeString())

	const hour = now.getHours()
	const minute = now.getMinutes()

	if (ringingAlarm) {
		const alreadyRinging = ringingAlarm.hour === hour && ringingAlarm.minute === minute

		// Coupe en cas d'alarme qui sonne déjà.
		if (alreadyRinging) return

		ringingAlarm = null
	}

	const alarms = listAlarms()
	const shouldRingAlarm = alarms.find((al) => al.hour === hour && al.minute === minute)

	if (shouldRingAlarm) {
		console.log('send ring:', shouldRingAlarm)
		sendToRenderer(win, 'ring', undefined)
		ringingAlarm = shouldRingAlarm
	}
}
