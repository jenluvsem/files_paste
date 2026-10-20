/**
 * Extract image files from clipboard data
 * @param clipboardData - DataTransfer from paste event
 * @returns Array of image files/blobs
 */
export function extractImagesFromClipboard(clipboardData: DataTransfer): Blob[] {
	const images: Blob[] = []
	const seenTypes = new Set<string>()

	// Process files first
	if (clipboardData.files && clipboardData.files.length > 0) {
		for (let i = 0; i < clipboardData.files.length; i++) {
			const file = clipboardData.files[i]
			if (isImageType(file.type)) {
				// Deduplicate by type since files and items may reference same content
				if (!seenTypes.has(file.type)) {
					images.push(file)
					seenTypes.add(file.type)
				}
			}
		}
	}

	// Process items (may contain additional images not in files)
	if (clipboardData.items && clipboardData.items.length > 0) {
		for (let i = 0; i < clipboardData.items.length; i++) {
			const item = clipboardData.items[i]
			if (item.type.startsWith('image/')) {
				// Deduplicate
				if (!seenTypes.has(item.type)) {
					// Get the blob from item
					const blob = item.getAsFile()
					if (blob) {
						images.push(blob)
						seenTypes.add(item.type)
					}
				}
			}
		}
	}

	return images
}

/**
 * Check if MIME type is an image type we support
 */
function isImageType(mimeType: string): boolean {
	const supportedTypes = [
		'image/png',
		'image/jpeg',
		'image/jpg',
		'image/gif',
		'image/webp',
	]

	return supportedTypes.includes(mimeType.toLowerCase())
}

/**
 * Check if clipboard contains any images
 */
export function hasImagesInClipboard(clipboardData: DataTransfer): boolean {
	// Check files
	if (clipboardData.files && clipboardData.files.length > 0) {
		for (let i = 0; i < clipboardData.files.length; i++) {
			if (isImageType(clipboardData.files[i].type)) {
				return true
			}
		}
	}

	// Check items
	if (clipboardData.items && clipboardData.items.length > 0) {
		for (let i = 0; i < clipboardData.items.length; i++) {
			if (clipboardData.items[i].type.startsWith('image/')) {
				return true
			}
		}
	}

	return false
}

/**
 * Check if clipboard contains only text (no images)
 */
export function isTextOnlyClipboard(clipboardData: DataTransfer): boolean {
	return !hasImagesInClipboard(clipboardData)
}
