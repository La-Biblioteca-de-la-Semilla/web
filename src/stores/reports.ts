import { defineStore } from 'pinia'
import { Modal } from 'bootstrap'
import type { CreateReportDto } from '@/dtos/reports/CreateReportDto'

const COLLECTION = 'reports'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    reportType: null as ReportType | null,
    id: null as string | null,
    modal: null as Modal | null
  }),
  actions: {
    openModal(reportType: ReportType, id: string) {
      this.reportType = reportType
      this.id = id

      const element = document.getElementById('reportsModal')
      if (!element) return

      this.modal = new Modal(element)
      this.modal.show()
    },
    closeModal() {
      this.reportType = null
      this.id = null

      this.modal?.hide()
    },
    async create(reason: ReportReasonKey, text: string) {

      if (!this.reportType) return Promise.reject('No report type')
      if (!this.id) return Promise.reject('No reported id')

      const createReportDto: CreateReportDto = {
        type: this.reportType.toString(),
        id: this.id,
        reason: reason.toString(),
        text: text
      }

      console.log('Reportando: ' + JSON.stringify(createReportDto))

      /*
      try {
          await addDoc(collection(db, COLLECTION), createReportDto);
      } catch (error) {
          console.error("Error creating suggestion:", error);
          return await Promise.reject(error);
      }
      */
    }
  }
})

export type ReportType = 'GALLERY_IMAGE' | 'COMMENT';

export const ReportReasons = {
  CONTENT_EXPLICIT: { value: 'CONTENT_EXPLICIT', text: 'Contenido explícito' },
  COPYRIGHT: { value: 'COPYRIGHT', text: 'Violación de derechos de autor' },
  SPAM: { value: 'SPAM', text: 'Spam o contenido irrelevante' },
  HATE_AND_VIOLENCE: { value: 'HATE_AND_VIOLENCE', text: 'Imágenes de odio o violencia' },
  OTHER: { value: 'OTHER', text: 'Otro' }
} as const

export type ReportReasonKey = keyof typeof ReportReasons; // "CONTENT_EXPLICIT" | "COPYRIGHT" | "SPAM" | "HATE_AND_VIOLENCE" | "OTHER"

export type ReportReasonValue = (typeof ReportReasons)[ReportReasonKey];