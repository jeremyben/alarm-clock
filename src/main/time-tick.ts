import { BrowserWindow } from 'electron'
import { sendToRenderer } from './ipc'

export function watchAndHandleTimeEvents(win: BrowserWindow) {
	setInterval(() => tick(win), 1000)
}

function tick(win: BrowserWindow) {
	const now = new Date()

	sendToRenderer(win, 'time-tick', now.toLocaleTimeString())
}
