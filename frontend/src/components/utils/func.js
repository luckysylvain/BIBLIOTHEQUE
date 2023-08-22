export function formatDateToCustomFormat(inputDate) {
    const date = new Date(inputDate);
    const padZero = (num) => (num < 10 ? "0" + num : num);
  
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const timezoneOffset = date.getTimezoneOffset();
    const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60));
    const timezoneMinutes = Math.abs(timezoneOffset % 60);
    const timezoneSign = timezoneOffset <= 0 ? "+" : "-";
  
    const formattedDate = `${year}${month}${day}T${hours}:${minutes}${timezoneSign}${padZero(timezoneHours)}${padZero(timezoneMinutes)}`;
  
    return formattedDate;
  }
  
  