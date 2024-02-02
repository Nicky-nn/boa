export const pFloat = (value: string | number): number => {
  try {
    return parseFloat(value.toString())
  } catch {
    return 0
  }
}
