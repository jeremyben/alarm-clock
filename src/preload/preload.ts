import { contextBridge, ipcRenderer } from 'electron'
import { ChannelError } from './channel-error'
import type { OverloadUnion, R, UnionToTuple } from '../type-utils'
import type { Alarm } from '../interfaces'

// On ne peut pas utiliser une instance de classe, car le prototype est supprimé.
// https://www.electronjs.org/docs/latest/api/context-bridge#api-functions

export namespace ExposedApi {
	const SEND_CHANNELS: UnionToTuple<SendChannel> = ['']
	const SEND_SYNC_CHANNELS: UnionToTuple<SendSyncChannel> = ['']
	const LISTEN_CHANNELS: UnionToTuple<ListenChannel> = ['time-tick']
	const INVOKE_CHANNELS: UnionToTuple<InvokeChannel> = ['list-alarms', 'create-alarm', 'remove-alarm']

	/**
	 * renderer => main
	 */
	export function send(channel: ''): void
	export function send(channel: SendChannel, ...args: any[]): void {
		if (SEND_CHANNELS.includes(channel)) {
			ipcRenderer.send(channel, ...args)
		} else {
			throw new ChannelError('send', channel)
		}
	}

	/**
	 * renderer => main => renderer (sync)
	 */
	export function sendSync(channel: ''): void
	export function sendSync(channel: SendSyncChannel, ...args: any[]): any {
		if (SEND_SYNC_CHANNELS.includes(channel)) {
			return ipcRenderer.sendSync(channel, ...args)
		} else {
			throw new ChannelError('sendSync', channel)
		}
	}

	/**
	 * main => renderer
	 */
	export function listen(channel: 'time-tick', listener: (time: string) => void): void
	export function listen(channel: ListenChannel, listener: (...args: any[]) => any) {
		if (LISTEN_CHANNELS.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => listener(...args))
		} else {
			throw new ChannelError('listen', channel)
		}
	}

	/**
	 * renderer => main => renderer (async)
	 */
	export async function invoke(channel: 'list-alarms'): Promise<Alarm[]>
	export async function invoke(channel: 'create-alarm', data: Alarm): Promise<R<Alarm[], string>>
	export async function invoke(channel: 'remove-alarm', data: Alarm): Promise<R<Alarm[], string>>
	export async function invoke(channel: InvokeChannel, data?: any): Promise<any> {
		if (INVOKE_CHANNELS.includes(channel)) {
			return ipcRenderer.invoke(channel, data)
		} else {
			throw new ChannelError('invoke', channel)
		}
	}

	type SendSig = OverloadUnion<ExposedApi['send']>
	type SendParams = Parameters<SendSig>
	export type SendChannel = SendParams[0]
	export type SendData<C extends SendChannel> = Extract<SendParams, [channel: C, data?: any]>[1]

	type SendSyncSig = OverloadUnion<ExposedApi['sendSync']>
	type SendSyncParams = Parameters<SendSyncSig>
	export type SendSyncChannel = SendSyncParams[0]
	export type SendSyncData<C extends SendSyncChannel> = Extract<SendSyncParams, [channel: C, data?: any]>[1]
	export type SendSyncResponse<C extends SendSyncChannel> = ReturnType<
		Extract<SendSyncSig, (channel: C, data?: any) => any>
	>

	type ListenSig = OverloadUnion<ExposedApi['listen']>
	type ListenParams = Parameters<ListenSig>
	export type ListenChannel = ListenParams[0]
	export type ListenCallback<C extends ListenChannel> = Extract<ListenParams, [channel: C, data?: any]>[1]
	export type ListenCallbackData<C extends ListenChannel> = Parameters<ListenCallback<C>>[0]

	type InvokeSig = OverloadUnion<ExposedApi['invoke']>
	type InvokeParams = Parameters<InvokeSig>
	export type InvokeChannel = InvokeParams[0]
	export type InvokeData<C extends InvokeChannel> = Extract<InvokeParams, [channel: C, data?: any]>[1]
	export type InvokeResponse<C extends InvokeChannel> = ReturnType<
		Extract<InvokeSig, (channel: C, data?: any) => any>
	>
}

export type ExposedApi = typeof ExposedApi

const EXPOSED_KEY: keyof Window & 'api' = 'api'

contextBridge.exposeInMainWorld(EXPOSED_KEY, ExposedApi)
