import api from './api'
import type { User } from '@/model/User'
import type { UpdateUserDto } from '@/dtos/users/UpdateUserDto'

export const userService = {
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  async updateUser(id: string, data: UpdateUserDto): Promise<void> {
    await api.put(`/users/${id}`, data)
  }
}
