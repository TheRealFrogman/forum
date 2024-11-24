export type Token = `${string}.${string}.${string}`
export function isToken(token: string): token is Token {
   return token.split('.').length === 3
}