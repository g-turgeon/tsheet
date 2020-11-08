export const Block = 'div'
export const Inline = 'span'

export const Time = ({ value }) => {
  const hrs = (Math.floor(Math.abs(value / 60)))
  const min = Math.abs(value % 60)
  return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export const Duration = ({ value }) => {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${hours && `${hours}h\u00a0` || ''}${minutes && `${minutes}m` || ''}`
}
