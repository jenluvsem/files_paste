/**
 * Check if paste event should be handled by our app
 * @param event - ClipboardEvent to check
 * @returns true if we should handle this paste event
 */
export function shouldHandlePasteEvent(event: ClipboardEvent): boolean {
	const target = event.target as HTMLElement | null
	const activeElement = document.activeElement as HTMLElement | null

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

	// Check for contenteditable that is not our app
	if (isContentEditable(target) || isContentEditable(activeElement)) {
		// Allow if it's in the Files app main content area
		if (!isInFilesAppMainArea(target) && !isInFilesAppMainArea(activeElement)) {
			return false
		}
	}

	return true
}

/**
 * Check if element is an input element
 */
function isInputElement(element: HTMLElement | null): boolean {
	if (!element) return false

	const tagName = element.tagName.toLowerCase()
	if (tagName === 'input' || tagName === 'textarea') {
		return true
	}

	// Check for contenteditable
	if (element.isContentEditable) {
		return true
	}

	return false
}

/**
 * Check if element is inside a modal
 */
function isInModal(element: HTMLElement | null): boolean {
	if (!element) return false

	// Check parent chain for modal class
	let current: HTMLElement | null = element
	while (current) {
		if (current.classList && (
			current.classList.contains('modal') ||
			current.classList.contains('oc-modal') ||
			current.getAttribute('role') === 'dialog'
		)) {
			return true
		}
		current = current.parentElement
	}

	return false
}

/**
 * Check if element is inside a sidebar
 */
function isInSidebar(element: HTMLElement | null): boolean {
	if (!element) return false

	let current: HTMLElement | null = element
	while (current) {
		if (current.classList && (
			current.classList.contains('sidebar') ||
			current.classList.contains('app-sidebar')
		)) {
			return true
		}
		current = current.parentElement
	}

	return false
}

/**
 * Check if element is contenteditable
 */
function isContentEditable(element: HTMLElement | null): boolean {
	if (!element) return false

	if (element.isContentEditable) {
		return true
	}

	// Check for contenteditable attribute
	return element.getAttribute('contenteditable') === 'true'
}

/**
 * Check if element is in the main content area of Files app
 */
function isInFilesAppMainArea(element: HTMLElement | null): boolean {
	if (!element) return false

	let current: HTMLElement | null = element
	while (current) {
		// Check if we're in the Files app content area
		if (current.id === 'app-content' ||
			current.classList.contains('files-content')) {
			return true
		}
		current = current.parentElement
	}

	return false
}
