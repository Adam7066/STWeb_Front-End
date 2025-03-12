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

export interface LCategory {
  id: number
  name: string
  value: string
}

export interface LTopic {
  id: number
  name: string
  value: string
  icon: string
  category_id: number
}

export interface LArticle {
  id: number
  title: number
  filename: string
  topic_id: number
  author_id: number
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

export interface LearnLatest {
  topic_name: string
  title: string
  author: string
  updated_at: Date
  url: string
}

interface LoginData {
  username: string
  email: string
  avatar: string
}

// Auth
export type LoginRes = ApiRes<LoginData>
export type SendVerifyCodeRes = ApiRes<string>
export type  RegisRes = ApiRes<string>

// User
export type GetUserRes = ApiRes<UserData>
export type GetUsersRes = ApiRes<UserData[]>
export type DeleteUserRes = ApiRes<string>
export type CreateUserRes = ApiRes<string>
export type UpdateUserRes = ApiRes<string>
export type GetUserRoleRes = ApiRes<string>

// Member
export type GetMembersRes = ApiRes<MemberData[]>
export type DeleteMemberRes = ApiRes<string>
export type CreateMemberRes = ApiRes<string>
export type UpdateMemberRes = ApiRes<string>

// Learn
export type GetLearnArticlesRes = ApiRes<Record<string, LearnCategory>>
export type GetLearnLatestRes = ApiRes<LearnLatest[]>

export type GetLCategoriesRes = ApiRes<LCategory[]>
export type UpdateLCategoryRes = ApiRes<string>
export type DeleteLCategoryRes = ApiRes<string>
export type CreateLCategoryRes = ApiRes<string>

export type GetLTopicsRes = ApiRes<LTopic[]>
export type UpdateLTopicRes = ApiRes<string>
export type DeleteLTopicRes = ApiRes<string>
export type CreateLTopicRes = ApiRes<string>

export type GetLArticlesRes = ApiRes<LArticle[]>
export type UpdateLArticleRes = ApiRes<string>
export type DeleteLArticleRes = ApiRes<string>
export type CreateLArticleRes = ApiRes<string>