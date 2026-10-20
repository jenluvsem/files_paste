import { describe, it, expect } from 'vitest'
import { shouldHandlePasteEvent } from '../../src/utils/targetFilter'

// Simple mock for ClipboardEvent that doesn't actually use DataTransfer
class MockClipboardEvent {
	type: string
	bubbles: boolean
	cancelable: boolean
	target: EventTarget | null = null
	constructor(type: string, options?: EventInit) {
		this.type = type
		this.bubbles = options?.bubbles ?? false
		this.cancelable = options?.cancelable ?? false
	}
}
// @ts-ignore
globalThis.ClipboardEvent = MockClipboardEvent

describe('targetFilter', () => {
	it('should handle paste when target is body', () => {
		// Simulate paste on body
		const event = new ClipboardEvent('paste', {
			bubbles: true,
			cancelable: true,
		})
		
		expect(shouldHandlePasteEvent(event)).toBe(true)
	})
})
