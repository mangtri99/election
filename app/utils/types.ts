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
  provinceId: number
  regencyId: number
  districtId: number
  villageId: number
  tpsId: number
  tpsNumber: string
  totalValidVote: number
  totalInvalidVote: number
  totalDptActive: number
  totalDptPassive: number
  totalOtherDpt: number
  totalDpt: number
  userId: number
  reportName: string
  reportPhoneNumber: string
  createdAt: Date
  updatedAt: Date
  candidateVotes: CandidateVote[]
  district: District
  regency: District
  province: District
  village: District
  tps: Tps
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
