export const getFirstNotUndefinedOnPosition = (position: number, ...args: unknown[][]): unknown | undefined => {
  for (const arg of args) {
    const element = arg.at(position)
    if (element !== undefined) {
      return element
    }
  }
  return undefined
}
