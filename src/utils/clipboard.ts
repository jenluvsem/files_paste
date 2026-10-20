const isImage = (type: string) => type.toLowerCase().startsWith('image/')

/**
 * Image files on the clipboard. `files` and `items` describe the same data in
 * Chromium/Firefox, so use `items` only when `files` has no image.
 */
export function getPastedImages(data: DataTransfer): File[] {
	const files = Array.from(data.files ?? []).filter((f) => isImage(f.type))
	if (files.length > 0) {
		return files
	}
	return Array.from(data.items ?? [])
		.filter((i) => i.kind === 'file' && isImage(i.type))
		.map((i) => i.getAsFile())
		.filter((f): f is File => f !== null)
}
