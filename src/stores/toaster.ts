import {defineStore} from "pinia";
import {v4 as uuidv4} from "uuid";

export type TToastStatus = 'success' | 'error' | 'warning' | 'info';

interface IToast {
    id: string;
    text: string;
    status: TToastStatus;
}

type ToastPayload = { timeout?: number, text: string }

const createToast = (text: string, status: TToastStatus): IToast => ({
    id: uuidv4(),
    text,
    status
})

const defaultTimeout: number = 3000;

export const useToasterStore = defineStore('toaster', {
    state: (): { toasts: IToast[] } => ({
        toasts: []
    }),
    actions: {
        updateState(payload: ToastPayload, status: TToastStatus): void {
            const {text, timeout} = payload;
            const toast = createToast(text, status);
            this.toasts.push(toast);

            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== toast.id);
            }, timeout ?? defaultTimeout)
        },
        success(payload: ToastPayload): void {
            this.updateState(payload, 'success');
        },
        error(payload: ToastPayload): void {
            this.updateState(payload, 'error');
        },
        warning(payload: ToastPayload): void {
            this.updateState(payload, 'warning');
        },
        info(payload: ToastPayload): void {
            this.updateState(payload, 'info');
        }
    }
})