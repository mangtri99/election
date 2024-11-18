import { z, type ZodTypeAny } from 'zod'

export const ZodStringNumberOrNull = z
  .string()
  .transform(value => (value === '' ? null : value))
  .nullable()
  .refine(value => value === null || !isNaN(Number(value)), {
    message: 'Invalid number'
  })
  .transform(value => (value === null ? null : Number(value)))

export const ZodStringNumberOrUndefined = z
  .string()
  .transform(value => (value === '' ? undefined : value))
  .nullable()
  .refine(value => value === undefined || !isNaN(Number(value)), {
    message: 'Invalid number'
  })
  .transform(value => (value === undefined ? undefined : Number(value)))

export const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform(value => (value === '' ? null : value))
    .nullable()
    .refine(value => value === null || !isNaN(Number(value)), {
      message: 'Nombre Invalide'
    })
    .transform(value => (value === null ? 0 : Number(value)))
    .pipe(zodPipe)
