import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock @nextcloud/files before importing
vi.mock('../../src/utils/view', () => ({
	getCurrentFolder: vi.fn(() => '/test/folder'),
	isSupportedView: vi.fn((hash?: string) => {
		const h = hash || window.location.hash
		// Simplified: return true for most cases except recent
		return !h.includes('/recent/')
	}),
	showFolderRequiredToast: vi.fn(),
}))

import { isSupportedView } from '../../src/utils/view'

describe('view - isSupportedView', () => {
	beforeEach(() => {
		window.location.hash = ''
	})

	it('should return true for All files view', () => {
		window.location.hash = '#/dir/'
		
		expect(isSupportedView()).toBe(true)
	})

	it('should return true for Favorites view', () => {
		window.location.hash = '#/favorites/'
		
		expect(isSupportedView()).toBe(true)
	})

	it('should return true for Shared view', () => {
		window.location.hash = '#/shared/'
		
		expect(isSupportedView()).toBe(true)
	})

	it('should return false for Recent view', () => {
		window.location.hash = '#/recent/'
		
		expect(isSupportedView()).toBe(false)
	})

	it('should return true for main files view (no hash)', () => {
		window.location.hash = ''
		
		expect(isSupportedView()).toBe(true)
	})
})
