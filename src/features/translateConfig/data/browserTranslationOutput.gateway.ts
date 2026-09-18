import type { TargetConfigTranslation } from '../model/translateConfig'
import type { TranslationOutputGateway } from '../model/translation.ports'
import { strToU8, zipSync } from 'fflate'

export class BrowserTranslationOutputGateway implements TranslationOutputGateway {
	copy(content: string) {
		return navigator.clipboard.writeText(content)
	}

	download(result: TargetConfigTranslation) {
		this.downloadBlob(new Blob([result.output], { type: 'text/plain;charset=utf-8' }), result.filename)
	}

	downloadArchive(results: TargetConfigTranslation[]) {
		const files = Object.fromEntries(results.map(result => [
			`${result.targetId}/${result.filename}`,
			strToU8(result.output),
		]))
		const archive = new Uint8Array(zipSync(files, { level: 6 })).buffer
		this.downloadBlob(new Blob([archive], { type: 'application/zip' }), 'mcp-configs.zip')
	}

	private downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = filename
		link.click()
		URL.revokeObjectURL(url)
	}
}
