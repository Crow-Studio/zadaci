import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { decrypt, encrypt } from './encryption'
import { tables, useDrizzle } from '~/server/utils/drizzle'

export async function getUserTOTPKey(
  userId: string,
): Promise<Uint8Array | null> {
  const result = await useDrizzle()
    .select()
    .from(tables.totpCredential)
    .where(eq(tables.totpCredential.userId, userId))

  if (result.length === 0) {
    throw new Error('Invalid user ID')
  }

  const encrypted = result[0].key
  if (encrypted === null) {
    return null
  }
  // Convert base64 string to Uint8Array
  const encryptedArray = new Uint8Array(Buffer.from(encrypted, 'base64'))
  return decrypt(encryptedArray)
}

export async function updateUserTOTPKey(
  userId: string,
  key: Uint8Array,
): Promise<void> {
  const encrypted = encrypt(key)

  await useDrizzle().transaction(async (tx) => {
    await tx
      .delete(tables.totpCredential)
      .where(eq(tables.totpCredential.userId, userId))

    await tx.insert(tables.totpCredential).values({
      userId,
      key: Buffer.from(encrypted).toString('base64'),
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uuidv4(),
    })
  })
}

export async function deleteUserTOTPKey(userId: string): Promise<void> {
  await useDrizzle()
    .delete(tables.totpCredential)
    .where(eq(tables.totpCredential.userId, userId))
}
