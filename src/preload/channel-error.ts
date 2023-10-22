export class ChannelError extends Error {
	constructor(type: 'listen' | 'invoke' | 'send' | 'sendSync', channel: string) {
		// Electron ne copie pas les propriétés des erreurs custom, donc on les distingue grâce à un préfixe.
		// https://github.com/electron/electron/issues/25596
		super(`[UnsupportedChannel] Renderer tries to ${type} to unsupported channel: "${channel}"`)
	}
}
