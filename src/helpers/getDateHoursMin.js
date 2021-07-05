export default function getDateHoursMin(dateString) {
  const date = new Date(dateString)
  return `${date.getHours()}:${date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes()}`
}