export interface ApiRes<T> {
  error: string
  data: T
}

export interface UserData {
  id: number
  username: string
  email: string
  phoneCountry: string
  phoneNumber: string
  role: string
  avatar: string
}

export type GetUserRes = ApiRes<UserData>
export type GetUsersRes = ApiRes<UserData[]>
export type DeleteUserRes = ApiRes<string>
export type CreateUserRes = ApiRes<string>
export type UpdateUserRes = ApiRes<string>
export type GetUserRoleRes = ApiRes<string>
