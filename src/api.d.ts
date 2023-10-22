import type { ExposedApi } from './preload/preload'

declare global {
	interface Window {
		api: ExposedApi
	}
}
