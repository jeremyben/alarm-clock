import { BrowserWindow } from 'electron'
import { sendToRenderer } from './ipc-methods'

export function handleTimeTickEvents(win: BrowserWindow) {
	tick(win)
	setInterval(() => tick(win), 1000)
}

function tick(win: BrowserWindow) {
	const now = new Date()

	sendToRenderer(win, 'time-tick', now.toLocaleTimeString())
}
