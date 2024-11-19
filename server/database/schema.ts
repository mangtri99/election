import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(), // GitHub Id
  title: text('title').notNull(),
  completed: integer('completed').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

export const roles = sqliteTable('roles', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users)
}))

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  roleId: integer('role_id'),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').unique(),
  phoneNumber: text('phone_number'),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id]
  }),
  userLocation: one(userLocations, {
    fields: [users.id],
    references: [userLocations.userId]
  })
}))

export const userLocations = sqliteTable('user_locations', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  userId: integer('user_id').references(() => users.id).notNull(),
  provinceId: integer('province_id').references(() => provinces.id),
  regencyId: integer('regency_id').references(() => regencies.id),
  districtId: integer('district_id').references(() => district.id),
  villageId: integer('village_id').references(() => villages.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const candidates = sqliteTable('candidates', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  candidateName: text('candidate_name').notNull(),
  viceCandidateName: text('vice_candidate_name').notNull(),
  orderNumber: text('order_number').notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// PROVINSI
export const provinces = sqliteTable('provinces', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// KABUPATEN
export const regencies = sqliteTable('regencies', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  provinceId: integer('province_id').references(() => provinces.id).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// KECAMATAN
export const district = sqliteTable('districts', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  regencyId: integer('regency_id').references(() => regencies.id).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// DESA/KELURAHAN
export const villages = sqliteTable('villages', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  districtId: integer('district_id').references(() => district.id).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const villagesRelations = relations(villages, ({ one }) => ({
  district: one(district, {
    fields: [villages.districtId],
    references: [district.id]
  })
}))

// TPS
export const tps = sqliteTable('tps', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  name: text('name').notNull(),
  villageId: integer('village_id').references(() => villages.id).notNull(),
  totalDpt: integer('total_dpt').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const tpsRelations = relations(tps, ({ one }) => ({
  village: one(villages, {
    fields: [tps.villageId],
    references: [villages.id]
  })
}))

// VOTES
export const tpsVotes = sqliteTable('tps_votes', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  provinceId: integer('province_id').references(() => provinces.id),
  regencyId: integer('regency_id').references(() => regencies.id),
  districtId: integer('district_id').references(() => district.id),
  villageId: integer('village_id').references(() => villages.id),
  tpsId: integer('tps_id').references(() => tps.id),
  tpsNumber: text('tps_number'),
  totalValidVote: integer('total_valid_vote').notNull().default(0), // total valid vote
  totalInvalidVote: integer('total_invalid_vote').notNull().default(0), // total invalid vote
  totalDptActive: integer('total_dpt_active').notNull().default(0), // voters who voted
  totalDptPassive: integer('total_dpt_passive').notNull().default(0), // voters who did not vote
  totalOtherDpt: integer('total_other_dpt').notNull().default(0), // voters who voted from outside the TPS
  totalDpt: integer('total_dpt').notNull().default(0),
  userId: integer('user_id').notNull().references(() => users.id).notNull(), // created by
  reportName: text('report_name'),
  reportPhoneNumber: text('report_phone_number'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const tpsVotesRelations = relations(tpsVotes, ({ one, many }) => ({
  province: one(provinces, {
    fields: [tpsVotes.provinceId],
    references: [provinces.id]
  }),
  regency: one(regencies, {
    fields: [tpsVotes.regencyId],
    references: [regencies.id]
  }),
  district: one(district, {
    fields: [tpsVotes.districtId],
    references: [district.id]
  }),
  village: one(villages, {
    fields: [tpsVotes.villageId],
    references: [villages.id]
  }),
  tps: one(tps, {
    fields: [tpsVotes.tpsId],
    references: [tps.id]
  }),
  candidateVotes: many(candidateVotes),
  tpsVoteImages: many(tpsVoteImages)
}))

export const tpsVoteImages = sqliteTable('tps_vote_images', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  tpsVoteId: integer('tps_vote_id').references(() => tpsVotes.id).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

// Candidate Votes
export const candidateVotes = sqliteTable('candidate_votes', {
  id: integer('id').primaryKey(({ autoIncrement: true })),
  voteId: integer('vote_id').references(() => tpsVotes.id).notNull(),
  candidateId: integer('candidate_id').references(() => candidates.id).notNull(),
  totalVote: integer('total_vote').notNull().default(0),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const candidateVotesRelations = relations(candidateVotes, ({ one }) => ({
  vote: one(tpsVotes, {
    fields: [candidateVotes.voteId],
    references: [tpsVotes.id]
  }),
  candidate: one(candidates, {
    fields: [candidateVotes.candidateId],
    references: [candidates.id]
  })
}))
