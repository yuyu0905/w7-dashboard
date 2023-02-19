export const date = (time) => {
  return new Date(time * 1000).toLocaleDateString()
}
