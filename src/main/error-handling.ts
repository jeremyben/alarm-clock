import { BrowserWindow, dialog } from 'electron'
import { inspect } from 'util'

export function alertError(error: unknown): void {
	console.error(error)

	if (error instanceof Error) {
		dialog.showErrorBox(Error.name, error.message)
	} else if (typeof error === 'string') {
		dialog.showErrorBox('Error', error)
	} else {
		dialog.showErrorBox('Unknown Error', inspect(error))
	}
}

export function alertUnhandledErrors() {
	process.on('uncaughtException', (error) => alertError(error))
	process.on('unhandledRejection', (error) => alertError(error))
}

export function handleWebContentErrors(win: BrowserWindow) {
	// https://www.electronjs.org/docs/latest/api/webview-tag#event-did-fail-load
	win.webContents.on('did-fail-load', (ev, errCode, errMessage) => {
		console.error(errCode, errMessage)
		dialog.showErrorBox("Impossible de charger l'application", errMessage)
	})

	// https://www.electronjs.org/docs/latest/api/web-contents#event-unresponsive
	win.webContents.on('unresponsive', () => {
		console.error('unresponsive')
		dialog.showErrorBox("L'application ne répond pas.", 'Veuillez attendre un moment ou la redémarrer directement.')
	})

	// https://www.electronjs.org/docs/latest/api/web-contents#event-render-process-gone
	win.webContents.on('render-process-gone', (ev, details) => {
		console.error('render-process-gone', details.reason)
		dialog.showErrorBox("L'application a planté.", 'Veuillez la redémarrer.')
	})

	// https://www.electronjs.org/docs/latest/api/web-contents#event-preload-error
	win.webContents.on('preload-error', (ev, p, error) => {
		console.error('preload-error', error)
		dialog.showErrorBox('Erreur critique.', "Veuillez redémarrer l'application.")
	})

	// Je logue aussi dans stderr les messages d'erreur de la console navigateur.
	// https://www.electronjs.org/docs/latest/api/web-contents#event-console-message
	win.webContents.on('console-message', (ev, level, message, line, sourceId) => {
		if (level === 3) {
			console.error('[web-console-error]', message, sourceId)
		}
	})
}
