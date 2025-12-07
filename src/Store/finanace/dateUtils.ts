export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Belgilanmagan';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Belgilanmagan';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return 'Belgilanmagan';
  }
};