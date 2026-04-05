export type Role = "admin" | "employee"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  leaveBalance: number
  joiningDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}
