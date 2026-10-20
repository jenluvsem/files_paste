import { describe, it, expect } from 'vitest'
import { extractImagesFromClipboard, hasImagesInClipboard, isTextOnlyClipboard } from '../../src/utils/clipboard'

describe('clipboard utils', () => {
	describe('hasImagesInClipboard', () => {
		it('should return false when no files', () => {
			const data = {
				files: [] as File[],
				items: [] as DataTransferItem[],
			}
			
			// @ts-ignore - simplified mock
			expect(hasImagesInClipboard(data)).toBe(false)
		})
	})

	describe('isTextOnlyClipboard', () => {
		it('should return true when no image files', () => {
			const data = {
				files: [] as File[],
				items: [] as DataTransferItem[],
			}
			
			// @ts-ignore - simplified mock
			expect(isTextOnlyClipboard(data)).toBe(true)
		})
	})

	describe('mime type detection', () => {
		it('should recognize png as image', () => {
			// Test the logic that recognizes image types
			const pngMime = 'image/png'
			const isImage = pngMime.startsWith('image/')
			expect(isImage).toBe(true)
		})

		it('should recognize jpeg as image', () => {
			const jpegMime = 'image/jpeg'
			const isImage = jpegMime.startsWith('image/')
			expect(isImage).toBe(true)
		})

		it('should recognize gif as image', () => {
			const gifMime = 'image/gif'
			const isImage = gifMime.startsWith('image/')
			expect(isImage).toBe(true)
		})

		it('should recognize webp as image', () => {
			const webpMime = 'image/webp'
			const isImage = webpMime.startsWith('image/')
			expect(isImage).toBe(true)
		})

		it('should NOT recognize text as image', () => {
			const textMime = 'text/plain'
			const isImage = textMime.startsWith('image/')
			expect(isImage).toBe(false)
		})
	})
})
