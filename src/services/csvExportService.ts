import type { Seed } from '@/model/Seed'
import { BOTANICAL_FAMILIES } from '@/model/Seed'
import { TAGS } from '@/model/Tag'

/**
 * Configuration for CSV export
 */
interface CsvExportConfig {
    filename?: string
    includeHeaders?: boolean
}

/**
 * Sowing period names by season (climate-independent)
 * 1-3: Spring months, 4-6: Summer months, 7-9: Autumn months, 10-12: Winter months
 */
const SOWING_PERIOD_NAMES: Record<number, string> = {
    1: 'Primavera 1',
    2: 'Primavera 2',
    3: 'Primavera 3',
    4: 'Verano 1',
    5: 'Verano 2',
    6: 'Verano 3',
    7: 'Otoño 1',
    8: 'Otoño 2',
    9: 'Otoño 3',
    10: 'Invierno 1',
    11: 'Invierno 2',
    12: 'Invierno 3'
}

/**
 * Converts sowing period numbers to readable text
 */
function formatSowingMonths(sow: number[]): string {
    if (!sow || sow.length === 0) return ''
    return sow
        .filter(m => m >= 1 && m <= 12)
        .sort((a, b) => a - b)
        .map(m => SOWING_PERIOD_NAMES[m])
        .join(', ')
}

/**
 * Converts botanical family code to readable text
 */
function formatBotanicalFamily(family: string | null): string {
    if (!family) return ''
    const familyInfo = BOTANICAL_FAMILIES[family as keyof typeof BOTANICAL_FAMILIES]
    return familyInfo ? familyInfo.text : family
}

/**
 * Converts tag IDs to readable text
 */
function formatTags(tags: string[]): string {
    if (!tags || tags.length === 0) return ''
    return tags
        .map(tagId => {
            const tag = TAGS.find(t => t.id === tagId)
            return tag ? tag.text : tagId
        })
        .join(', ')
}

/**
 * Formats germination days range
 */
function formatGermination(min: number | null, max: number | null): string {
    if (min === null && max === null) return ''
    if (min !== null && max !== null) {
        return min === max ? `${min} días` : `${min}-${max} días`
    }
    return min !== null ? `${min} días` : `${max} días`
}

/**
 * Escapes a value for CSV format
 * - Wraps in quotes if contains comma, newline, or quotes
 * - Escapes quotes by doubling them
 */
function escapeCsvValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return ''

    const stringValue = String(value)

    // If the value contains a comma, newline, or double quote, wrap it in quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        // Escape double quotes by doubling them
        return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
}

/**
 * CSV column definitions with headers and value extractors
 */
const CSV_COLUMNS = [
    { header: 'Nombre', getValue: (seed: Seed) => seed.name },
    { header: 'Especie', getValue: (seed: Seed) => seed.species },
    { header: 'Familia Botánica', getValue: (seed: Seed) => formatBotanicalFamily(seed.family) },
    { header: 'Descripción', getValue: (seed: Seed) => seed.description },
    { header: 'Meses de Siembra', getValue: (seed: Seed) => formatSowingMonths(seed.sow) },
    { header: 'Etiquetas', getValue: (seed: Seed) => formatTags(seed.tags) },
    { header: 'Germinación', getValue: (seed: Seed) => formatGermination(seed.germinationMin, seed.germinationMax) },
    { header: 'SFG Original', getValue: (seed: Seed) => seed.sfgOriginal ?? '' },
    { header: 'SFG Multisiembra', getValue: (seed: Seed) => seed.sfgMultisow ?? '' },
    { header: 'SFG Mata', getValue: (seed: Seed) => seed.sfgClump ?? '' },
    { header: 'Envío', getValue: (seed: Seed) => seed.sentOn || 'Sin envío' }
]

/**
 * Generates CSV content from an array of seeds
 */
function generateCsvContent(seeds: Seed[], includeHeaders: boolean = true): string {
    const rows: string[] = []

    // Add header row
    if (includeHeaders) {
        rows.push(CSV_COLUMNS.map(col => escapeCsvValue(col.header)).join(','))
    }

    // Add data rows
    for (const seed of seeds) {
        const values = CSV_COLUMNS.map(col => escapeCsvValue(col.getValue(seed)))
        rows.push(values.join(','))
    }

    return rows.join('\n')
}

/**
 * Generates a filename with current date and filter info
 */
function generateFilename(seedCount: number): string {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
    return `semillas_${seedCount}_${dateStr}.csv`
}

/**
 * Downloads the CSV file
 * Uses the native browser download functionality
 */
function downloadCsv(content: string, filename: string): void {
    // Add BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF'
    const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' })

    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    URL.revokeObjectURL(url)
}

/**
 * Main export function
 * Exports the given seeds array to a CSV file and triggers download
 */
export function exportSeedsToCsv(seeds: Seed[], config: CsvExportConfig = {}): void {
    const {
        filename = generateFilename(seeds.length),
        includeHeaders = true
    } = config

    if (seeds.length === 0) {
        console.warn('No seeds to export')
        return
    }

    const csvContent = generateCsvContent(seeds, includeHeaders)
    downloadCsv(csvContent, filename)
}

/**
 * Service object for CSV export operations
 */
export const csvExportService = {
    exportSeedsToCsv,
    generateCsvContent
}
