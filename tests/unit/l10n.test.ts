import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Every t('files_paste', '...') string in src must be translated in every shipped language.
const src = readdirSync('src', { recursive: true })
	.filter((f) => String(f).endsWith('.ts'))
	.map((f) => readFileSync(`src/${f}`, 'utf8'))
	.join('\n')
const strings = [...src.matchAll(/\bt\('files_paste', '([^']+)'/g)].map((m) => m[1])
const langs = readdirSync('l10n').filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5))

describe('l10n', () => {
	it('finds the source strings', () => {
		expect(strings.length).toBeGreaterThanOrEqual(6)
	})

	it.each(langs)('%s.json and %s.js translate every string and agree', (lang) => {
		const json = JSON.parse(readFileSync(`l10n/${lang}.json`, 'utf8')).translations
		const js = readFileSync(`l10n/${lang}.js`, 'utf8')
		for (const s of strings) {
			expect(json[s], `${lang}: "${s}"`).toBeTruthy()
			expect(js).toContain(JSON.stringify(json[s]))
		}
		for (const [k, v] of Object.entries<string>(json)) {
			// placeholders must survive translation
			expect([...v.matchAll(/\{\w+\}/g)].map(String)).toEqual([...k.matchAll(/\{\w+\}/g)].map(String))
		}
	})
})
