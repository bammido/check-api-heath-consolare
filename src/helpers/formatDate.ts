export function formatDate(date: string | Date, options: { withHours?: boolean }) {
  const dateFormat = new Date(date);

  function addZero(number: number) {
    return number.toString().padStart(2, '0');
  }

  const day = addZero(dateFormat.getDate());
  const month = addZero(dateFormat.getMonth() + 1);
  const year = dateFormat.getFullYear();

  let dateFormated = `${day}/${month}/${year}`;

  if (options.withHours) {
    const hour = addZero(dateFormat.getHours());
    const minutes = addZero(dateFormat.getMinutes());
    const seconds = addZero(dateFormat.getSeconds());

    const time = `${hour}:${minutes}: ${seconds}`;
    dateFormated += ' - ' + time;
  }

  return dateFormated;
}
