import {defineStore} from 'pinia'
import Cookies from 'js-cookie'

const COOKIE_NAME = 'cookies-consent'
const EXPIRATION_DAYS: number = 365
const STATES = {
    NOT_SET: undefined,
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
}

export const useCookiesStore = defineStore('cookies', {
    state: () => ({}),
    getters: {
        isAccepted: () => {
            return Cookies.get(COOKIE_NAME) === STATES.ACCEPTED
        },
        isNotSet: () => {
            return Cookies.get(COOKIE_NAME) === STATES.NOT_SET
        }
    },
    actions: {
        acceptCookies() {
            Cookies.set(COOKIE_NAME, STATES.ACCEPTED, {expires: EXPIRATION_DAYS})
        },
        rejectCookies() {
            Cookies.set(COOKIE_NAME, STATES.REJECTED)
        }
    }
})
