import { BrowserWindow } from 'electron'
import { sendToRenderer } from './ipc-methods'
import { listAlarms } from './alarms'

export function handleTimeTickEvents(win: BrowserWindow) {
	tick(win)
	const intervalId = setInterval(() => tick(win), 1000)

	win.on('close', () => clearInterval(intervalId))
}

// State mémoire pour éviter de lancer plusieurs alarmes pendant une même minute.
let isRinging = false

function tick(win: BrowserWindow) {
	const now = new Date()

	// On envoie directement l'heure au renderer avant de passer au calcul de l'alarme.
	sendToRenderer(win, 'time-tick', now.toLocaleTimeString())

	const hour = now.getHours()
	const minute = now.getMinutes()

	const alarms = listAlarms()

	const shouldRingAlarm = alarms.find((al) => al.hour === hour && al.minute === minute)

	if (shouldRingAlarm) {
		if (!isRinging) {
			sendToRenderer(win, 'ring', undefined)
		}
		isRinging = true
	} else {
		// On doit bien réinitialiser.
		isRinging = false
	}
}
