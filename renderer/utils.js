export const timeFormat = value => {
  const hrs = (Math.floor(Math.abs(value / 60)))
  const min = Math.abs(value % 60)
  return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}
