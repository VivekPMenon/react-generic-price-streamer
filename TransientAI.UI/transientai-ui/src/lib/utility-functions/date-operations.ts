export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth();
}

export function isSameDayDate(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate();
}

export function isSameHour(date1: Date, date2: Date): boolean {
  return date1.getHours() === date2.getHours();
}

export function isSameMinute(date1: Date, date2: Date): boolean {
  return date1.getMinutes() === date2.getMinutes();
}

export function getCurrentTimestamp() {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    // second: '2-digit',
    hour12: true,
  });

  return currentTime;
}

export function isDateRightNow(timestamp: Date): boolean {
  const dateOfNow = new Date();
  const datesHavSameYear = isSameYear(timestamp, dateOfNow);
  const datesHavSameMonth = isSameMonth(timestamp, dateOfNow);
  const datesHavSameDay = isSameDayDate(timestamp, dateOfNow);
  const datesHavSameHour = isSameHour(timestamp, dateOfNow);
  const datesHavSameMinute = isSameMinute(timestamp, dateOfNow);
  return datesHavSameYear && datesHavSameMonth && datesHavSameDay && datesHavSameHour && datesHavSameMinute;
}

export function isDateToday(timestamp: Date): boolean {
  const dateOfNow = new Date();
  const datesHaveSameYear = isSameYear(timestamp, dateOfNow);
  const datesHaveSameMonth = isSameMonth(timestamp, dateOfNow);
  const datesHaveSameDay = isSameDayDate(timestamp, dateOfNow);
  return datesHaveSameYear && datesHaveSameMonth && datesHaveSameDay;
}

export function isDateYesterday(timestamp: Date): boolean {
  const dateOfNow = new Date();
  const yesterday = getYesterdaysDate();
  const datesHaveSameYear = isSameYear(timestamp, dateOfNow);
  const datesHaveSameMonth = isSameMonth(timestamp, dateOfNow);
  const isYesterdayInDay = isSameDayDate(timestamp, yesterday);
  return datesHaveSameYear && datesHaveSameMonth && isYesterdayInDay;
}

export function getYesterdaysDate(): Date {
  const dateOfNow = new Date();
  const yesterday = new Date();
  yesterday.setDate(dateOfNow.getDate() - 1);
  return yesterday;
}

export function isDateThisMonth(timestamp: Date): boolean {
  const dateOfNow = new Date();
  const datesHaveSameYear = isSameYear(timestamp, dateOfNow);
  const datesHaveSameMonth = isSameMonth(timestamp, dateOfNow);
  return datesHaveSameYear && datesHaveSameMonth;
}

export function areDatesIdentical(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

export function formatDateToHHMM(date: Date): string {
  let hrs = date.getHours();
  const mins = date.getMinutes();
  const clockType = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  if (hrs === 0) {
      hrs = 12;
  }
  return (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins) + " " + clockType;
}

export function formatDateToHHMMSS(date: Date): string {
  let hrs = date.getHours();
  const mins = date.getMinutes();
  const sec = date.getSeconds();
  const clockType = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  if (hrs === 0) {
      hrs = 12;
  }
  return (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (sec < 10 ? "0" + sec : sec) + " " + clockType;
}

export function formatDateToDDMMYY(date: Date, prefixSingleDigitsWithZero: boolean): string {
  const dayDate = date.getDate();
  const month = (date.getMonth() + 1);
  return (prefixSingleDigitsWithZero && dayDate < 10 ? "0" + dayDate : dayDate) + "/" + (prefixSingleDigitsWithZero && month < 10 ? "0" + month : month) + "/" + date.getFullYear().toString().substr(-2);
}

export function formatDateToMonthNameAndDay(date: Date, abbreviateMonths: boolean): string {
  let months;
  if (abbreviateMonths) {
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  } else {
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }
  return months[date.getMonth()] + " " + date.getDate();
}
