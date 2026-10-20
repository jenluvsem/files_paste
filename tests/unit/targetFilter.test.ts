import { describe, expect, it } from 'vitest'
import { shouldHandlePasteEvent } from '../../src/utils/targetFilter'

const ev = (target: Element) => ({ target }) as unknown as ClipboardEvent
const mk = (html: string) => {
	document.body.innerHTML = html
	return document.body.firstElementChild as HTMLElement
}

describe('shouldHandlePasteEvent', () => {
	it('handles paste on the page body', () => {
		document.body.innerHTML = ''
		expect(shouldHandlePasteEvent(ev(document.body))).toBe(true)
	})
	it('ignores inputs and textareas', () => {
		expect(shouldHandlePasteEvent(ev(mk('<input>')))).toBe(false)
		expect(shouldHandlePasteEvent(ev(mk('<textarea></textarea>')))).toBe(false)
	})
	it('ignores dialogs and sidebars', () => {
		const d = mk('<div role="dialog"><p>x</p></div>')
		expect(shouldHandlePasteEvent(ev(d.firstElementChild as Element))).toBe(false)
		const s = mk('<div class="app-sidebar"><p>x</p></div>')
		expect(shouldHandlePasteEvent(ev(s.firstElementChild as Element))).toBe(false)
	})
})
