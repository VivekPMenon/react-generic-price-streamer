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

export function isToday(date: Date|null|undefined): boolean {
  if (!date) {
    return false;
  }
  const today = new Date();
  return isSameMonth(today, date) &&
      isSameDayDate(today, date) &&
      isSameYear(today, date);
}

export function getCurrentDate() {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
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

export function formatDateToHHMM(date: Date | string): string {
  let dateObj = typeof date === 'string' ? new Date(date) : date;
  let hrs = dateObj.getHours();
  const mins = dateObj.getMinutes();
  const clockType = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  if (hrs === 0) {
      hrs = 12;
  }
  return (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins) + " " + clockType;
}

export function formatDateString(dateString: string|undefined|null) {
  // Should push out to common method - dup code
  if (!dateString || dateString.length === 0) {
    return '';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) {
    return '';
  }

  return date.toDateString();
}


export function formatDateMilitaryTime(value: string) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
}

export function tryParseIsoDate(dateString: string|undefined|null) {
  if (!dateString || dateString.length === 0) {
    return {valid: false, parsed: null};
  }

  const date = new Date(dateString);
  if (!Number.isNaN(date.valueOf())) {
    return {valid: true, parsed: date};
  }

  const parts = dateString.split('T');
  if (parts.length !== 2) {
    return {valid: false, parsed: null};
  }

  // HACK
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\dZ?$/;
  if (!timeRegex.test(parts[1])) {
    const date = new Date(parts[0] + 'T' + parts[1].replaceAll('-', ':'));
    if (Number.isNaN(date.valueOf())) {
      return {valid: false, parsed: null};
    }
    return {valid: true, parsed: date};
  }

  return {valid: false, parsed: null};
}

export function tryParseAndFormat(isoString: string|undefined|null) {
  const result = tryParseIsoDate(isoString);
  if (result.valid && result.parsed) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',  // "Mar"
      day: '2-digit',  // "06"
      hour: 'numeric', // "6"
      minute: '2-digit', // "00"
      hour12: true,    // "PM"
    }).format(result.parsed);
  }
  return '';
}

export function tryParseAndFormatDateOnly(isoString: string|undefined|null) {
  const result = tryParseIsoDate(isoString);
  if (result.valid && result.parsed) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',  // "Mar"
      day: '2-digit',  // "06"
      year: 'numeric' // "PM"
    }).format(result.parsed);
  }
  return '';
}

export function formatDate(isoString: string|undefined|null) {
  if (!isoString || isoString.length === 0) {
    return '';
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.valueOf())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',  // "Mar"
    day: '2-digit',  // "06"
    year: 'numeric',
    hour: 'numeric', // "6"
    minute: '2-digit', // "00"
    hour12: true,    // "PM"
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',  // "Mar"
    day: '2-digit',  // "06"
    year: 'numeric',
    hour: 'numeric', // "6"
    minute: '2-digit', // "00"
    hour12: true,    // "PM"
  }).format(date);
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

export function isTimeBetween(startTime: string, endTime: string, checkTime?: string): boolean {
  const now = new Date();

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes, 0);

  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes, 0);

  let checkDate: Date;
  if (checkTime) {
    const [checkHours, checkMinutes] = checkTime.split(":").map(Number);
    checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), checkHours, checkMinutes, 0);
  } else {
    checkDate = new Date();
  }

  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return checkDate >= startDate && checkDate <= endDate;
}

export function isTimeBefore(time: string) {
  const now = new Date();

  const [timeHours, timeMinutes] = time.split(":").map(Number);
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeHours, timeMinutes, 0);

  return date < new Date();
}

export function getMillisecondsTill(time: string): number {
  const now = new Date();

  const [timeHours, timeMinutes] = time.split(":").map(Number);
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeHours, timeMinutes, 0);

  return new Date().getTime() - date.getTime();
}

export function   parseLocalDate(value: string|null|undefined): Date|null {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export const formatTime = (timeString: string | undefined) => {
  if (!timeString) {
    return '';
  }
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function parseIsoDate(value: string|null|undefined): Date|null {
  if (!value) {
    return null;
  }
  return new Date(value.endsWith('T00:00:00')
      ? value + 'Z'
      : value);
}
