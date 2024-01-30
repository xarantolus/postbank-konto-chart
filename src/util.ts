export function formatDateBasic(date: Date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function formatDateMonthName(date: Date) {
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
    "August", "September", "Oktober", "November", "Dezember"
  ]

  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}
