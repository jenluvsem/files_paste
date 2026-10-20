/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
	const mimeToExtension: Record<string, string> = {
		'image/png': 'png',
		'image/jpeg': 'jpg',
		'image/jpg': 'jpg',
		'image/gif': 'gif',
		'image/webp': 'webp',
	}

	return mimeToExtension[mimeType.toLowerCase()] || 'png'
}

/**
 * Generate filename with timestamp
 * Format: "Screenshot YYYY-MM-DD HH-mm-ss.ext"
 */
export function generateFilename(mimeType: string): string {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')

	const ext = getExtensionFromMime(mimeType)

	return `Screenshot ${year}-${month}-${day} ${hours}-${minutes}-${seconds}.${ext}`
}

/**
 * Resolve filename collision by adding suffix
 * @param filename - Original filename
 * @param existingFiles - Array of existing filenames in the folder
 * @returns Unique filename that doesn't collide with existing files
 */
export function resolveCollision(filename: string, existingFiles: string[]): string {
	if (!existingFiles.includes(filename)) {
		return filename
	}

	// Extract name and extension
	const lastDot = filename.lastIndexOf('.')
	let name: string
	let ext: string

	if (lastDot > 0) {
		name = filename.substring(0, lastDot)
		ext = filename.substring(lastDot)
	} else {
		name = filename
		ext = ''
	}

	// Try sequential suffixes
	let counter = 2
	while (existingFiles.includes(`${name} (${counter})${ext}`)) {
		counter++
		if (counter > 1000) {
			// Safety limit
			break
		}
	}

	return `${name} (${counter})${ext}`
}

/**
 * Check if filename conflicts with existing files
 */
export function hasCollision(filename: string, existingFiles: string[]): boolean {
	return existingFiles.includes(filename)
}
