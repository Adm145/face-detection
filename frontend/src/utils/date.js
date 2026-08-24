export const toDDMMYYYY = (isoDate) => {
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

export const toISODate = (ddmmyyyy) => {
  const [day, month, year] = ddmmyyyy.split('-')
  return `${year}-${month}-${day}`
}
