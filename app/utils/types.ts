export interface APIResponseData<T> {
  data?: T
}

export interface Candidate {
  id: number
  name: string
  candidateName: string
  viceCandidateName: string
  orderNumber: string
  image: null
  createdAt: Date
  updatedAt: Date
}

export interface Province {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Regency {
  id: number
  name: string
  provinceId: number
  createdAt: Date
  updatedAt: Date
}

export interface District {
  id: number
  name: string
  regencyId: number
  createdAt: Date
  updatedAt: Date
}

export interface Village {
  id: number
  name: string
  districtId: number
  createdAt: Date
  updatedAt: Date
  district?: District
}

export interface Tps {
  id: number
  name: string
  villageId: number
  totalDpt: number
  createdAt: Date
  updatedAt: Date
  village: Village
}

export interface CandidateVote {
  id: number
  voteId: number
  candidateId: number
  totalVote: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

export interface TPSVote {
  id: number
  provinceID: number
  regencyID: number
  districtID: number
  villageID: number
  tpsID: number
  tpsNumber: string
  totalValidVote: number
  totalInvalidVote: number
  totalDptActive: number
  totalDptPassive: number
  totalOtherDpt: number
  totalDpt: number
  userID: number
  reportName: string
  reportPhoneNumber: string
  createdAt: Date
  updatedAt: Date
  candidateVotes: CandidateVote[]
  district: District
  regency: Regency
  province: Province
  village: Village
  tps: Tps
  user: User
  candidateName1: string
  candidateTotalVote1: number
  candidateName2: string
  candidateTotalVote2: number
  candidateName3: string
  candidateTotalVote3: number
}

export interface User {
  id: number
  roleId: number | null
  name: string
  username: string
  password: string
  email: string | null
  phoneNumber: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}
