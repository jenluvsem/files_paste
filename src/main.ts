/**
 * Main entry point for files_paste app
 * Simplified version for Nextcloud Files
 */

function init() {
	// Only add listener in Files app
	if (!isFilesApp()) {
		return
	}

	// Listen for paste events on document
	document.addEventListener('paste', handlePaste, true)
}

/**
 * Check if we're in the Files app
 */
function isFilesApp() {
	// Check if we're in the Files app by looking at the body class
	return document.body.classList.contains('app-files')
}

/**
 * Handle paste event
 */
async function handlePaste(event) {
	// Check if we should handle this paste event (F2)
	if (!shouldHandlePasteEvent(event)) {
		return
	}

	// Check if view supports pasting (F1)
	if (!isSupportedView()) {
		showFolderRequiredToast()
		return
	}

	const clipboardData = event.clipboardData
	if (!clipboardData) {
		return
	}

	// Check if there's text but no images (F3)
	if (isTextOnlyClipboard(clipboardData)) {
		// Don't prevent default - let text paste normally
		return
	}

	// Extract images from clipboard
	const images = extractImagesFromClipboard(clipboardData)
	if (images.length === 0) {
		return
	}

	// Prevent default to stop browser's default paste behavior
	event.preventDefault()

	// Get current folder
	const currentFolder = getCurrentFolder()

	// Get existing files for collision detection
	let existingFiles = []
	try {
		existingFiles = await getExistingFiles(currentFolder)
	} catch (e) {
		console.error('Failed to get existing files:', e)
	}

	// Upload each image
	for (const image of images) {
		try {
			await uploadImage(image, currentFolder, existingFiles)
		} catch (e) {
			console.error('Failed to upload image:', e)
			showErrorToast('Failed to upload image')
		}
	}
}

/**
 * Check if paste event should be handled by our app
 */
function shouldHandlePasteEvent(event) {
	const target = event.target
	const activeElement = document.activeElement

	// Check if target or active element is in an input field
	if (isInputElement(target) || isInputElement(activeElement)) {
		return false
	}

	// Check if target or active element is in a modal
	if (isInModal(target) || isInModal(activeElement)) {
		return false
	}

	// Check if target or active element is in a sidebar
	if (isInSidebar(target) || isInSidebar(activeElement)) {
		return false
	}

	return true
}

/**
 * Check if element is an input element
 */
function isInputElement(element) {
	if (!element) return false

	const tagName = element.tagName.toLowerCase()
	if (tagName === 'input' || tagName === 'textarea') {
		return true
	}

	if (element.isContentEditable) {
		return true
	}

	return false
}

/**
 * Check if element is inside a modal
 */
function isInModal(element) {
	if (!element) return false

	let current = element
	while (current) {
		if (current.classList && (
			current.classList.contains('modal') ||
			current.classList.contains('oc-modal') ||
			current.getAttribute('role') === 'dialog')
		) {
			return true
		}
		current = current.parentElement
	}

	return false
}

/**
 * Check if element is inside a sidebar
 */
function isInSidebar(element) {
	if (!element) return false

	let current = element
	while (current) {
		if (current.classList && (
			current.classList.contains('sidebar') ||
			current.classList.contains('app-sidebar'))
		) {
			return true
		}
		current = current.parentElement
	}

	return false
}

/**
 * Get current folder path from Files router
 */
function getCurrentFolder() {
	const hash = window.location.hash
	const match = hash.match(/#\/dir\/([^?]*)/)
	if (match && match[1]) {
		return '/' + decodeURIComponent(match[1])
	}
	return '/'
}

/**
 * Check if current view supports pasting
 */
function isSupportedView() {
	const hash = window.location.hash

	// Recent view doesn't have a folder
	if (hash.includes('/recent/')) {
		return false
	}

	return true
}

/**
 * Get list of existing files in folder
 */
async function getExistingFiles(folderPath) {
	try {
		const user = getCurrentUser()
		const response = await fetch(`/remote.php/dav/files/${user}${folderPath}`, {
			method: 'PROPFIND',
			headers: {
				'Depth': '1',
				'Content-Type': 'application/xml',
			},
		})

		if (!response.ok) {
			return []
		}

		const text = await response.text()
		const parser = new DOMParser()
		const doc = parser.parseFromString(text, 'application/xml')

		const files = []
		const responses = doc.getElementsByTagName('d:response')
		for (let i = 0; i < responses.length; i++) {
			const href = responses[i].getElementsByTagName('d:href')[0]?.textContent
			if (href) {
				const filename = href.split('/').pop()
				if (filename && filename !== '' && filename !== folderPath.split('/').pop()) {
					files.push(filename)
				}
			}
		}

		return files
	} catch (e) {
		console.error('Failed to list existing files:', e)
		return []
	}
}

/**
 * Get current username
 */
function getCurrentUser() {
	// @ts-ignore
	return window.OC?.getCurrentUser()?.uid || 'guest'
}

/**
 * Extract image files from clipboard data
 */
function extractImagesFromClipboard(clipboardData) {
	const images = []
	const seenTypes = new Set()

	if (clipboardData.files && clipboardData.files.length > 0) {
		for (let i = 0; i < clipboardData.files.length; i++) {
			const file = clipboardData.files[i]
			if (file.type.startsWith('image/')) {
				if (!seenTypes.has(file.type)) {
					images.push(file)
					seenTypes.add(file.type)
				}
			}
		}
	}

	if (clipboardData.items && clipboardData.items.length > 0) {
		for (let i = 0; i < clipboardData.items.length; i++) {
			const item = clipboardData.items[i]
			if (item.type.startsWith('image/')) {
				if (!seenTypes.has(item.type)) {
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
 * Check if clipboard contains only text (no images)
 */
function isTextOnlyClipboard(clipboardData) {
	// Check files
	if (clipboardData.files && clipboardData.files.length > 0) {
		for (let i = 0; i < clipboardData.files.length; i++) {
			if (clipboardData.files[i].type.startsWith('image/')) {
				return false
			}
		}
	}

	// Check items
	if (clipboardData.items && clipboardData.items.length > 0) {
		for (let i = 0; i < clipboardData.items.length; i++) {
			if (clipboardData.items[i].type.startsWith('image/')) {
				return false
			}
		}
	}

	return true
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMime(mimeType) {
	const mimeToExtension = {
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
 */
function generateFilename(mimeType) {
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
 * Resolve filename collision
 */
function resolveCollision(filename, existingFiles) {
	if (!existingFiles.includes(filename)) {
		return filename
	}

	const lastDot = filename.lastIndexOf('.')
	let name, ext

	if (lastDot > 0) {
		name = filename.substring(0, lastDot)
		ext = filename.substring(lastDot)
	} else {
		name = filename
		ext = ''
	}

	let counter = 2
	while (existingFiles.includes(`${name} (${counter})${ext}`)) {
		counter++
		if (counter > 1000) {
			break
		}
	}

	return `${name} (${counter})${ext}`
}

/**
 * Upload a single image using WebDAV
 */
async function uploadImage(image, folderPath, existingFiles) {
	const mimeType = image.type || 'image/png'
	let filename = generateFilename(mimeType)

	// Resolve filename collision
	filename = resolveCollision(filename, existingFiles)

	// Update existing files for next iteration
	existingFiles.push(filename)

	try {
		const user = getCurrentUser()
		const response = await fetch(`/remote.php/dav/files/${user}${folderPath}/${filename}`, {
			method: 'PUT',
			body: image,
			headers: {
				'Content-Type': mimeType,
			},
		})

		if (!response.ok) {
			throw new Error(`Upload failed: ${response.status}`)
		}

		// Show success toast
		showSuccessToast(filename)

		// Emit event for Files to pick up the new file
		window.dispatchEvent(new CustomEvent('files:node:created', {
			detail: { filename, folderPath, mimeType, size: image.size }
		}))

	} catch (e) {
		console.error('Upload failed:', e)

		if (e.message?.includes('403') || e.message?.includes('forbidden')) {
			showErrorToast('No permission to upload here')
		} else if (e.message?.includes('quota')) {
			showErrorToast('Not enough storage space')
		} else {
			showErrorToast('Upload failed')
		}

		throw e
	}
}

/**
 * Show toast message using Nextcloud dialogs or fallback
 */
function showToast(message, type = 'info') {
	// Try to use Nextcloud's dialogs if available
	// @ts-ignore
	if (window.OC?.dialogs) {
		// @ts-ignore
		if (type === 'error') {
			// @ts-ignore
			window.OC.dialogs.alert(message, 'Error')
		} else {
			// @ts-ignore
			window.OC.dialogs.info(message)
		}
	} else {
		// Fallback to console and basic alert
		console.log(message)
	}
}

function showFolderRequiredToast() {
	showToast('Open a folder to paste')
}

function showSuccessToast(filename) {
	showToast(`Pasted ${filename}`)
}

function showErrorToast(message) {
	showToast(message, 'error')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init)
} else {
	init()
}

export { init, handlePaste }
