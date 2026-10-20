import { describe, expect, it } from 'vitest'
import { getPasteFolder } from '../../src/utils/view'

const r = (view: string | undefined, dir?: string) => ({ params: { view }, query: { dir } })

describe('getPasteFolder', () => {
	it('uses dir in the files view, root by default', () => {
		expect(getPasteFolder(r('files', '/Kanban'))).toBe('/Kanban')
		expect(getPasteFolder(r('files'))).toBe('/')
	})
	it('has no folder in Recent and trash', () => {
		expect(getPasteFolder(r('recent', '/x'))).toBeNull()
		expect(getPasteFolder(r('trashbin'))).toBeNull()
	})
	it('allows favorites/shares only inside a folder', () => {
		expect(getPasteFolder(r('favorites'))).toBeNull()
		expect(getPasteFolder(r('favorites', '/Kanban'))).toBe('/Kanban')
	})
	it('has no folder without a router', () => {
		expect(getPasteFolder(undefined)).toBeNull()
	})
})
