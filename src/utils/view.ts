export interface FilesRouter {
	params: { view?: string }
	query: { dir?: string }
}

/** Views that have no real destination folder at their root. */
const NO_FOLDER_VIEWS = ['recent', 'trashbin']

/**
 * Folder to paste into, or null when the current view has none (Recent, trash,
 * the roots of Favorites/Shares).
 */
export function getPasteFolder(router: FilesRouter | undefined): string | null {
	if (!router) {
		return null
	}
	const view = router.params?.view ?? 'files'
	const dir = router.query?.dir || '/'
	if (NO_FOLDER_VIEWS.includes(view) || (view !== 'files' && dir === '/')) {
		return null
	}
	return dir
}
