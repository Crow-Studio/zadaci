import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export function zipStr(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function unzipStr(base64: string): string {
  const binary = atob(base64)

  const buffer = strToU8(binary, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}
