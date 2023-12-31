/// <reference types="electron-vite/node" />

import { app, BrowserWindow, Menu } from 'electron'
import icon from '../../resources/icon.png?asset'
import { PRELOAD_PATH, RENDERER_HMR_URL, RENDERER_PATH } from './constants'
import { alertUnhandledErrors, handleWebContentErrors } from './error-handling'
import { handleTimeTickEvents } from './time-tick'
import path from 'path'
import { handleAlarmRendererEvents } from './alarms'

alertUnhandledErrors()

if (import.meta.env.DEV) {
	app.setPath('appData', path.join(__dirname, '..', '..', 'temp'))
}

const gotTheLock = app.requestSingleInstanceLock()

if (gotTheLock) {
	startApp()
} else {
	app.quit()
}

async function startApp() {
	Menu.setApplicationMenu(null)

	await app.whenReady()

	handleAppEvents()

	const win = createWindow()

	win.webContents.on('did-finish-load', () => {
		handleTimeTickEvents(win)
		handleAlarmRendererEvents()
	})
}

function createWindow() {
	const win = new BrowserWindow({
		title: 'Clock',
		width: 800,
		height: 800,
		center: true,
		icon,
		webPreferences: {
			preload: PRELOAD_PATH,
			disableBlinkFeatures: 'Auxclick', // https://github.com/doyensec/electronegativity/wiki/AUXCLICK_JS_CHECK
		},
	})

	handleWebContentErrors(win)

	// https://electron-vite.org/guide/hmr
	if (!app.isPackaged && RENDERER_HMR_URL) {
		win.loadURL(RENDERER_HMR_URL)
	} else {
		win.loadFile(RENDERER_PATH)
	}

	if (import.meta.env.DEV) {
		win.webContents.openDevTools({ mode: 'right' })
	}

	return win
}

function handleAppEvents() {
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})
}
