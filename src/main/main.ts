/// <reference types="electron-vite/node" />

import { app, BrowserWindow, Menu } from 'electron'
import icon from '../../resources/icon.png?asset'
import { PRELOAD_PATH, RENDERER_HMR_URL, RENDERER_PATH } from './config'

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	app.quit()
} else {
	Menu.setApplicationMenu(null)

	app.whenReady().then(() => {
		const win = createWindow()
	})

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})
}

function createWindow() {
	const win = new BrowserWindow({
		title: 'Clock',
		width: 900,
		height: 670,
		center: true,
		icon,
		webPreferences: {
			preload: PRELOAD_PATH,
			disableBlinkFeatures: 'Auxclick', // https://github.com/doyensec/electronegativity/wiki/AUXCLICK_JS_CHECK
		},
	})

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
