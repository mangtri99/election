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
