import { translate as t } from '@nextcloud/l10n'
import { getPastedImages } from './utils/clipboard'
import { generateFilename, resolveCollision } from './utils/filename'
import { shouldHandlePasteEvent } from './utils/targetFilter'
import { getPasteFolder } from './utils/view'

// Nextcloud 34 ships these as globals; bundling @nextcloud/dialogs or /upload would drag in Vue.
// OCP.Toast: core toasts. _nc_uploader: Files' own uploader, so it shows Files' progress bar and refreshes the list.
const w = window as any
const uid = document.head.dataset.user ?? ''
const filesRoot = `${location.origin}/remote.php/dav/files/${encodeURIComponent(uid)}`
const encodePath = (p: string) => p.split('/').map(encodeURIComponent).join('/')

// Names claimed by pastes whose upload has not finished (a second paste can list the folder before the first PUT lands).
const pending = new Set<string>()

function errorText(e: any): string {
	switch (e?.response?.status) {
	case 403: return t('files_paste', 'You do not have permission to upload here')
	case 413: return t('files_paste', 'The image is too large')
	case 507: return t('files_paste', 'Not enough storage space')
	default: return t('files_paste', 'Could not upload the image')
	}
}

/** Names of the entries in a folder. */
async function listNames(dir: string): Promise<string[]> {
	const res = await fetch(`${filesRoot}${encodePath(dir)}`, {
		method: 'PROPFIND',
		headers: { Depth: '1', requesttoken: document.head.dataset.requesttoken ?? '' },
	})
	if (!res.ok) {
		throw Object.assign(new Error(`PROPFIND ${res.status}`), { response: res })
	}
	const xml = new DOMParser().parseFromString(await res.text(), 'application/xml')
	return Array.from(xml.getElementsByTagNameNS('DAV:', 'href'))
		.map((h) => decodeURIComponent((h.textContent ?? '').replace(/\/$/, '').split('/').pop() ?? ''))
}

async function uploadOne(blob: File, dir: string, taken: string[]): Promise<void> {
	const name = resolveCollision(generateFilename(blob.type), taken)
	taken.push(name)
	const path = `${dir === '/' ? '' : dir}/${name}`
	pending.add(path)
	try {
		await w._nc_uploader.upload(path, new File([blob], name, { type: blob.type }), filesRoot)
		w.OCP.Toast.success(t('files_paste', 'Pasted {name}', { name }))
	} catch (e) {
		console.error('files_paste: upload failed', e)
		w.OCP.Toast.error(errorText(e))
	} finally {
		pending.delete(path)
	}
}

async function onPaste(event: ClipboardEvent): Promise<void> {
	if (!event.clipboardData || !shouldHandlePasteEvent(event)) {
		return
	}
	const images = getPastedImages(event.clipboardData)
	if (images.length === 0) {
		return // text etc.: leave the browser's default untouched
	}
	event.preventDefault()

	const dir = getPasteFolder(w.OCP?.Files?.Router)
	if (dir === null) {
		w.OCP.Toast.info(t('files_paste', 'Open a folder to paste'))
		return
	}

	// Never overwrite: list the folder first, abort if that fails.
	let taken: string[]
	try {
		// Entry 0 is the folder itself; harmless in the name list.
		taken = await listNames(dir)
	} catch (e) {
		console.error('files_paste: listing failed', e)
		w.OCP.Toast.error(errorText(e))
		return
	}
	const prefix = `${dir === '/' ? '' : dir}/`
	for (const p of pending) {
		if (p.startsWith(prefix)) {
			taken.push(p.slice(prefix.length))
		}
	}
	await Promise.all(images.map((img) => uploadOne(img, dir, taken)))
}

document.addEventListener('paste', onPaste)
