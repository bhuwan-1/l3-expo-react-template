import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.extend(utc);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'A few seconds',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
  weekStart: 1,
});

dayjs.locale('en');

type DateType = string | Date | Dayjs;

abstract class DateUtils {
  static formatTimeRange(start: string, end: string) {
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  static formatTime(time: string) {
    return dayjs(time, 'HH:mm').format('h:mma');
  }

  static format12HourTime(time: string) {
    return dayjs(time, 'HH:mm').format('hh:mm A');
  }

  static format24HourTime = (time: string) => {
    return dayjs(time, 'h:mm a').format('HH:mm');
  };

  static serializeTime(hours: number, minutes: number) {
    return dayjs(`${hours}:${minutes}`, 'H:m').format('HH:mm');
  }

  static addOneHourTime(time: string) {
    return dayjs(time, 'HH:mm').add(1, 'hour').format('hh:mm A');
  }

  static formatShortDate(date: DateType, format = 'ddd Do MMM, YYYY') {
    return dayjs(date).format(format);
  }

  static formatLongDate(date: DateType, format = 'dddd MMMM Do, YYYY') {
    return dayjs(date).startOf('day').format(format);
  }

  static formatLongDateWithoutDay(date: DateType, format = 'MMMM Do, YYYY') {
    return dayjs(date).format(format);
  }

  static formatDateRange(start: DateType, end: DateType) {
    return dayjs(start).isSame(end, 'date')
      ? dayjs(start).format('MMM D, YYYY')
      : `${dayjs(start).format('MMM D')} - ${dayjs(end).format('MMM D, YYYY')}`;
  }

  static formatDateTimeRange(
    startDate: DateType,
    endDate: DateType,
    startTime: string,
    endTime: string
  ) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const dateRange = start.isSame(end, 'date')
      ? start.format('MMM D, YYYY')
      : `${dayjs(startDate).format('MMM D')} - ${dayjs(endDate).format(
          'MMM D, YYYY'
        )}`;

    return `${dateRange} | ${DateUtils.format12HourTime(
      startTime
    )} - ${DateUtils.format12HourTime(endTime)}`;
  }

  static formatDateRangeWithWeek(date: Dayjs) {
    const mondayOfDate = date.startOf('week');
    const weekRange = new Array(7)
      .fill(null)
      .map((_, i) => mondayOfDate.add(i, 'day'));
    const startDate = weekRange[0];
    const endDate = weekRange[6];
    //Check if both dates are in the same month and year
    if (
      startDate.isSame(endDate, 'month') &&
      startDate.isSame(endDate, 'year')
    ) {
      // If they are, format as "1-7 Sept YYYY"
      return `${startDate.format('D')}-${endDate.format('D MMM YYYY')}`;
    } else {
      // If not, format as "1 Sept - 7 Oct YYYY"
      return `${startDate.format('D MMM')} - ${endDate.format('D MMM YYYY')}`;
    }
  }

  static formatDate(date: DateType, inputFormat = 'YYYY-MM-DD') {
    return dayjs(date, inputFormat).format('Do MMM, YYYY');
  }

  static formatMonthYear(date: DateType) {
    return dayjs(date).format('MMMM YYYY');
  }

  static fromNow(date: DateType, hideAgo = true) {
    return dayjs(date).fromNow(hideAgo);
  }

  static formatToAge(date: DateType) {
    const now = dayjs();
    const diff = now.diff(date, 'month', true);

    if (diff < 0) {
      return 'Unborn';
    }

    if (diff < 1) {
      return 'Less than a month';
    }

    const years = Math.floor(diff / 12);
    const months = Math.round(diff % 12);

    const yearString =
      years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
    const monthString =
      months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '';

    return `${yearString}${
      yearString && monthString ? ', ' : ''
    }${monthString}`;
  }

  static serializeDate(date: DateType) {
    return dayjs(date).format('YYYY-MM-DD');
  }

  static combineDateAndTime(date: string, time: string) {
    const timeDayJs = dayjs(time, 'HH:mm');
    return dayjs(date)
      .set('hours', timeDayJs.get('hours'))
      .set('minutes', timeDayJs.get('minutes'))
      .format('YYYY-MM-DDTHH:mm:ss');
  }

  static get daysOfWeek() {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  static toTimeFormat(
    date: DateType,
    inputDateFormat = 'YYYY-MM-DDTHH:mm:ssZ[Z]'
  ) {
    return dayjs(date, inputDateFormat).format('HH:mm');
  }

  static getStartAndEndDateOfWeek(date: string, isDaily: boolean) {
    const startDate = isDaily
      ? date
      : dayjs(date).startOf('week').format('YYYY-MM-DD');

    const result: { start_date: string; end_date?: string } = {
      start_date: startDate,
    };

    if (!isDaily) {
      const endDate = dayjs(date).endOf('week').format('YYYY-MM-DD');
      result.end_date = endDate;
    }

    return result;
  }

  static formatToDay(date: string) {
    return dayjs(date).format('dddd');
  }

  static formatToDotDate(date: DateType) {
    return dayjs(date).format('DD.MM.YYYY');
  }

  static getTimeDifference(startTime: string, endTime: string) {
    // Parse times
    const start = dayjs(`2000-01-01T${startTime}`);
    const end = dayjs(`2000-01-01T${endTime}`);

    // Handle case when end time is on the next day
    let diffMinutes = end.diff(start, 'minute');
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Add a day worth of minutes
    }

    // Return difference in hours as decimal
    return +(diffMinutes / 60).toFixed(1);
  }

  /**
   * Checks if a date is today.
   * @param date - The date to check (can be string, Date, or Dayjs)
   * @returns true if the date is today, false otherwise
   */
  static isToday(date: DateType): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

  /**
   * Checks if a time slot is today and in the past.
   * @param dateTime - The date and time in ISO string format
   * @returns true if the slot is today and in the past, false otherwise
   */
  static isTodayAndInPast(dateTime: string): boolean {
    const slotTime = dayjs(dateTime);
    const now = dayjs();

    return slotTime.isSame(now, 'day') && slotTime.isBefore(now);
  }

  /**
   * Combine event date and time in local timezone.
   * Prevents timezone shifts - ensures date and time appear the same across all timezones.
   *
   * @param dateString - Date string (e.g., "2025-11-06" or "2025-11-06T00:00:00.000Z")
   * @param timeString - Time string in HH:mm format (e.g., "22:00")
   * @returns Date object in local timezone with specified date and time
   *
   * @example
   * // Event on Nov 6 at 22:00 will show as Nov 6, 22:00 in all timezones
   * combineEventDateAndTime("2025-11-06T00:00:00.000Z", "22:00")
   */
  static combineEventDateAndTime(dateString: string, timeString: string): Date {
    // Parse date as UTC to get calendar date without timezone interpretation
    const dateUTC = dayjs.utc(dateString);

    // Parse time
    const time = dayjs(timeString, 'HH:mm');

    // Create new date in LOCAL timezone with extracted date + time components
    // This ensures the same date and time appear everywhere
    return dayjs()
      .year(dateUTC.year())
      .month(dateUTC.month())
      .date(dateUTC.date())
      .hour(time.hour())
      .minute(time.minute())
      .second(0)
      .millisecond(0)
      .toDate();
  }
}

export default DateUtils;
