import { describe, it, expect, beforeEach } from 'vitest'
import { generateFilename, resolveCollision, getExtensionFromMime } from '../../src/utils/filename'

describe('filename', () => {
	describe('getExtensionFromMime', () => {
		it('should return png for image/png', () => {
			expect(getExtensionFromMime('image/png')).toBe('png')
		})

		it('should return jpeg for image/jpeg', () => {
			expect(getExtensionFromMime('image/jpeg')).toBe('jpg')
		})

		it('should return gif for image/gif', () => {
			expect(getExtensionFromMime('image/gif')).toBe('gif')
		})

		it('should return webp for image/webp', () => {
			expect(getExtensionFromMime('image/webp')).toBe('webp')
		})

		it('should return png for unknown mime types', () => {
			expect(getExtensionFromMime('image/unknown')).toBe('png')
		})
	})

	describe('generateFilename', () => {
		it('should generate filename with Screenshot prefix', () => {
			const result = generateFilename('image/png')
			
			expect(result).toMatch(/^Screenshot \d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}\.png$/)
		})

		it('should use correct extension for jpeg', () => {
			const result = generateFilename('image/jpeg')
			
			expect(result).toMatch(/\.jpg$/)
		})

		it('should use correct extension for gif', () => {
			const result = generateFilename('image/gif')
			
			expect(result).toMatch(/\.gif$/)
		})

		it('should use correct extension for webp', () => {
			const result = generateFilename('image/webp')
			
			expect(result).toMatch(/\.webp$/)
		})
	})

	describe('resolveCollision', () => {
		it('should return original name if no collision', () => {
			const existingFiles: string[] = []
			
			const result = resolveCollision('Screenshot.png', existingFiles)
			
			expect(result).toBe('Screenshot.png')
		})

		it('should add (2) suffix for first collision', () => {
			const existingFiles = ['Screenshot.png']
			
			const result = resolveCollision('Screenshot.png', existingFiles)
			
			expect(result).toBe('Screenshot (2).png')
		})

		it('should add (3) suffix for second collision', () => {
			const existingFiles = ['Screenshot.png', 'Screenshot (2).png']
			
			const result = resolveCollision('Screenshot.png', existingFiles)
			
			expect(result).toBe('Screenshot (3).png')
		})

		it('should skip existing numbers and find next available', () => {
			const existingFiles = ['Screenshot.png', 'Screenshot (2).png', 'Screenshot (4).png']
			
			const result = resolveCollision('Screenshot.png', existingFiles)
			
			expect(result).toBe('Screenshot (3).png')
		})

		it('should handle multiple existing files', () => {
			const existingFiles = [
				'Screenshot.png',
				'Screenshot (2).png',
				'Screenshot (3).png',
				'Screenshot (4).png',
				'Screenshot (5).png'
			]
			
			const result = resolveCollision('Screenshot.png', existingFiles)
			
			expect(result).toBe('Screenshot (6).png')
		})

		it('should NEVER overwrite existing file', () => {
			const existingFiles = ['Screenshot.png']
			
			const result = resolveCollision('Screenshot.png', existingFiles)
			
			expect(result).not.toBe('Screenshot.png')
			expect(existingFiles).not.toContain(result)
		})
	})
})
