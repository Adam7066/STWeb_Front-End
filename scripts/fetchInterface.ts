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

export interface MemberData {
  id: number
  avatar: string
  name: string
  description: string
  urlGithub: string
  urlBlog: string
}

export interface LearnCategory {
  name: string
  topics: Record<string, LearnTopic>
}

export interface LearnTopic {
  topic_name: string
  topic_icon: string
  articles: LearnArticle[]
}

export interface LearnArticle {
  title: string
  filename: string
  author: string
  updated_at: Date
}

export type GetUserRes = ApiRes<UserData>
export type GetUsersRes = ApiRes<UserData[]>
export type DeleteUserRes = ApiRes<string>
export type CreateUserRes = ApiRes<string>
export type UpdateUserRes = ApiRes<string>
export type GetUserRoleRes = ApiRes<string>

export type GetMembersRes = ApiRes<MemberData[]>
export type DeleteMemberRes = ApiRes<string>
export type CreateMemberRes = ApiRes<string>
export type UpdateMemberRes = ApiRes<string>

export type GetLearnArticlesRes = ApiRes<Record<string, LearnCategory>>