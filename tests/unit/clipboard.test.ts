import { describe, expect, it } from 'vitest'
import { getPastedImages } from '../../src/utils/clipboard'

const f = (name: string, type: string) => new File(['x'], name, { type })
const item = (file: File) => ({ kind: 'file', type: file.type, getAsFile: () => file })

describe('getPastedImages', () => {
	it('returns every image in files, even of the same type', () => {
		const a = f('a.png', 'image/png')
		const b = f('b.png', 'image/png')
		expect(getPastedImages({ files: [a, b], items: [item(a), item(b)] } as any)).toEqual([a, b])
	})
	it('does not double-count files that are also listed in items', () => {
		const a = f('a.png', 'image/png')
		expect(getPastedImages({ files: [a], items: [item(a)] } as any)).toEqual([a])
	})
	it('falls back to items when files is empty', () => {
		const a = f('a.png', 'image/png')
		expect(getPastedImages({ files: [], items: [item(a)] } as any)).toEqual([a])
	})
	it('ignores text and non-image files', () => {
		const pdf = f('a.pdf', 'application/pdf')
		expect(getPastedImages({ files: [pdf], items: [{ kind: 'string', type: 'text/plain' }] } as any)).toEqual([])
	})
})
