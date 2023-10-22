import { app } from 'electron'
import path from 'path'

if (import.meta.env.DEV) {
	app.setPath('appData', path.join(__dirname, '..', '..', 'temp'))
}

export const PRELOAD_PATH = path.join(__dirname, '..', 'preload', 'preload.js')
export const RENDERER_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
export const RENDERER_HMR_URL = process.env['ELECTRON_RENDERER_URL']

export const USER_DATA_PATH = app.getPath('userData')
