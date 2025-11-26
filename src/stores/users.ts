import { defineStore } from 'pinia'
import { type User } from '@/model/User'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { userService } from '@/services/userService'


export const useUsersStore = defineStore('users', {
  state: () => ({
    user: null as User | null,
    users: [] as User[]
  }),
  actions: {
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const uid = result.user.uid

        // Store Firebase ID token for backend BearerAuth
        const token = await result.user.getIdToken()
        localStorage.setItem('authToken', token)

        await this.fetchCurrentUser(uid)
        return result.user
      } catch (error) {
        console.error('Error during Google Sign-In:', error)
        throw error
      }
    },

    async signOut(): Promise<void> {
      try {
        await signOut(getAuth())
        localStorage.removeItem('authToken')
        this.user = null
      } catch (error) {
        console.error('Error during sign out:', error)
        throw error
      }
    },

    async fetchCurrentUser(uid: string) {
      this.user = await this.getUserById(uid)
    },

    async getUserById(uid: string): Promise<User> {
      let user = this.users.find((u: User) => u.id === uid)
      if (user) return user

      user = await userService.getUserById(uid)

      this.users.push(user)

      return user
    },

    async save() {
      if (!this.user?.id) {
        return Promise.reject(new Error('No user loaded'))
      }
      try {
        const payload: import('@/dtos/users/UpdateUserDto').UpdateUserDto = {
          name: this.user.name,
          image: this.user.image,
          have: this.user.have,
          want: this.user.want
        }
        if ((this.user as any).offer) {
          ;(payload as any).offer = (this.user as any).offer
        }
        await userService.updateUser(this.user.id, payload)
        return
      } catch (reason) {
        return Promise.reject(reason)
      }
    },
    async updateHave(seedId: string, state: boolean) {
      if (this.user) {
        if (!Array.isArray(this.user.have)) this.user.have = []

        if (state) {
          if (!this.user.have.includes(seedId)) {
            this.user.have = [...this.user.have, seedId]
          }
        } else {
          if (this.user.have.length > 0) {
            this.user.have = this.user.have.filter(id => id !== seedId)
          }
        }
        await this.save()
      }
    },
    async updateWant(seedId: string, state: boolean) {
      if (this.user) {
        if (!Array.isArray(this.user.want)) this.user.want = []

        if (state) {
          if (!this.user.want.includes(seedId)) {
            this.user.want = [...this.user.want, seedId]
          }
        } else {
          if (this.user.want.length > 0) {
            this.user.want = this.user.want.filter(id => id !== seedId)
          }
        }
        await this.save()
      }
    }
  }
})