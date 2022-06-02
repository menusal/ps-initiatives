export const formatDate = (time) => {
  return new Date(time.seconds * 1000 + time.nanoseconds / 1000000)
}
