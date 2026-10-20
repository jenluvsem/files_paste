import { showInfo } from '@nextcloud/dialogs'
import { translate as t } from '@nextcloud/l10n'

/**
 * Get current folder path from Files router
 */
export function getCurrentFolder(): string {
	// Try to get from @nextcloud/files
	try {
		// eslint-disable-next-line @nextcloud/namespace
		const { getCurrentDirectory } = require('@nextcloud/files')
		return getCurrentDirectory() || '/'
	} catch (e) {
		// Fallback to parsing URL hash
		return getCurrentFolderFromHash()
	}
}

/**
 * Get folder from URL hash (fallback)
 */
function getCurrentFolderFromHash(): string {
	const hash = window.location.hash
	const match = hash.match(/#\/dir\/([^?]*)/)
	if (match && match[1]) {
		return '/' + decodeURIComponent(match[1])
	}
	return '/'
}

/**
 * Check if current view supports pasting
 * Supported: All files, Favorites, Shared (folders)
 * Not supported: Recent (no folder context)
 */
export function isSupportedView(): boolean {
	const hash = window.location.hash

	// Recent view doesn't have a folder
	if (hash.includes('/recent/')) {
		return false
	}

	// Other views without folder context
	if (!hash.includes('/dir/') && !hash.includes('/favorites/') && !hash.includes('/shared/')) {
		// If no specific view, assume it's the main files view
		return true
	}

	return true
}

/**
 * Show toast message when folder is required
 */
export function showFolderRequiredToast(): void {
	showInfo(t('files_paste', 'Open a folder to paste'))
}

/**
 * Show success toast after paste
 */
export function showSuccessToast(filename: string): void {
	showInfo(t('files_paste', 'Pasted {filename}', { filename }))
}

/**
 * Show error toast
 */
export function showErrorToast(message: string): void {
	// Using showInfo for now - could use showError for more prominence
	showInfo(message)
}
