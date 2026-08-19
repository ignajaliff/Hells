/** Une clases condicionalmente sin traer una dependencia para tres líneas. */
export function cn(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ')
}
