import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import type { ExposedApi } from '../preload/preload'

/**
 * renderer => main => renderer (async)
 */
export function handleInvoke<C extends ExposedApi.InvokeChannel>(
	channel: C,
	handler: (data: ExposedApi.InvokeData<C>) => ExposedApi.InvokeResponse<C> | Awaited<ExposedApi.InvokeResponse<C>>
) {
	ipcMain.handle(channel, (ev, arg) => {
		validateSender(ev)
		return handler(arg)
	})
}

/**
 * renderer => main
 */
export function handleSend<C extends ExposedApi.SendChannel>(
	channel: C,
	handler: (data: ExposedApi.SendData<C>) => void
) {
	ipcMain.on(channel, (ev, arg) => {
		validateSender(ev)
		return handler(arg)
	})
}

/**
 * renderer => main => renderer (sync)
 */
export function handleSendSync<C extends ExposedApi.SendSyncChannel>(
	channel: C,
	handler: (data: ExposedApi.SendSyncData<C>) => ExposedApi.SendSyncResponse<C>
) {
	ipcMain.on(channel, (ev, arg) => {
		validateSender(ev)
		ev.returnValue = handler(arg)
	})
}

/**
 * main => renderer
 */
export function sendToRenderer<C extends ExposedApi.ListenChannel>(
	win: BrowserWindow,
	channel: C,
	data: ExposedApi.ListenCallbackData<C>
) {
	win.webContents.send(channel, data)
}

/**
 * https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages
 */
function validateSender(ev: IpcMainEvent | IpcMainInvokeEvent) {
	const { origin } = new URL(ev.senderFrame.url)
	console.log('origin', origin)
}
