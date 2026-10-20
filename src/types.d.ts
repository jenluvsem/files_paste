// Type declarations for Nextcloud globals

interface NextcloudOC {
	getCurrentUser(): { uid: string }
	dialogs?: {
		info(message: string, title?: string): void
		alert(message: string, title?: string): void
	}
}

interface Window {
	OC?: NextcloudOC
}

declare const window: Window

export {}
