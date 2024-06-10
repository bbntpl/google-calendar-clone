import dayjs, { Dayjs } from 'dayjs';

import { hasOnlyDigits, objKeysToArr } from './reusable-funcs';
import {
	CalendarUnits,
	DateUnits,
} from '../contexts/CalendarConfigContext/index.model';

// An array that contains three or more elements
type ArrayThreeOrMore<T> = [T, T, ...T[]];

type AvailableMinutes = '00' | '15' | '30' | '45';

interface DayjsObjByDay {
	date: DateUnits | undefined,
	calendarUnit: CalendarUnits,
	index: number,
}

interface DayTimeElement {
	dayPortion: 'AM' | 'PM',
	hour: number,
	hourIndex: number,
	minute: AvailableMinutes,
	time: string,
	timeWithoutMinutes: string,
}

interface DateFormatting {
	yearFormat?: string,
	monthFormat?: string,
	dayFormat?: string,
}

/**
 * Converts a date to the specified time zone.
 * 
 * @param {Date|string} date - The date to be converted.
 * @param {string} tzString - The target time zone.
 * @returns {Date} The converted date in the target time zone.
 */

export function convertTZ(date: Date, tzString: string): Date {
	return new Date((typeof date === 'string' ? new Date(date) : date)
		.toLocaleString('en-US', { timeZone: tzString }));
}

export const dateToday: DateUnits = {
	year: dayjs().year(),
	month: Number(dayjs().format('MM')),
	day: Number(dayjs().format('DD')),
};

export const dayjsObj = ({ year, month, day }: DateUnits) => {
	return dayjs(`${year.toString()}-${month.toString()}-${day.toString()}`);
}

export const dayjsObjByDay = ({ date, calendarUnit, index }: DayjsObjByDay) => {
	const validYear = date?.year || 2000;
	const validMonth = (date?.month ?? 0)
	const validDay = date?.day || 1;

	const dateFormat = `${validYear}-${validMonth}-${validDay}`;

	if (calendarUnit === 'day') {
		return dayjs(dateFormat).add(index, 'day');
	} else {
		return dayjs(dateFormat).day(index);
	}
}

export function getMonth(month = dayjs().month()) {
	month = Math.floor(month);
	const year = dayjs().year();
	const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
	let dayCount = 0 - firstDayOfTheMonth;
	const daysMatrix = new Array(6).fill([]).map(() => {
		return new Array(7).fill(null).map(() => {
			dayCount += 1;
			return dayjs(new Date(year, month, dayCount));
		});
	});
	return daysMatrix;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getYear(year = dayjs().year()) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	year = Math.floor(year);
	return Array.from({ length: 12 }, (_, i) => {
		return getMonth(i);
	});
}

// Get date unit values (year, month, day) from a Dayjs object 
// using specified date formats.
export function getDateValues(dateObj: Dayjs, dateFormats: DateFormatting)
	: DateUnits {
	const {
		yearFormat = 'YYYY',
		monthFormat = 'MM',
		dayFormat = 'DD',
	} = dateFormats;
	const year = dateObj.format(yearFormat);
	const month = dateObj.format(monthFormat);
	const day = dateObj.format(dayFormat);

	// The properties are based on date codes (1 to 12), not zero-indexed (0 to 11)
	return {
		// The year must always be typed as number
		year: Number(year),
		month: hasOnlyDigits(month) ? Number(month) : month,
		day: hasOnlyDigits(day) ? Number(day) : day,
	};
}

export function getShortDate(dateObj: Dayjs) {
	const { year, month, day } = getDateValues(dateObj, {
		yearFormat: 'YYYY',
		monthFormat: 'MMM',
		dayFormat: 'DD',
	});
	return `${month} ${day}, ${year}`
}

export function getScheduleTimeOptions() {
	const minutes = ['00', '15', '30', '45'];
	const dayTime: DayTimeElement[] = new Array(96)
		.fill([])
		.map((_, i) => {
			const hourCount = Math.floor(i / minutes.length) + 1;
			const hours = (hourCount % 12) === 0 ? 12 : hourCount % 12;
			const ampm = hourCount < 12 || hourCount === 24 ? 'AM' : 'PM';
			return {
				dayPortion: ampm,
				hour: hours,
				hourIndex: hourCount - 1,
				minute: minutes[i % minutes.length] as AvailableMinutes,
				time: `${hours}:${minutes[i % minutes.length]} ${ampm}`,
				timeWithoutMinutes: `${hours} ${ampm}`,
			}
		});

	// Move the last group of items(12AM) on front 
	const lastElementIndex = dayTime.length - 1;
	for (let i = 0; i < minutes.length; i++) {
		dayTime.unshift(dayTime.splice(lastElementIndex, 1)[0]);
	}
	return dayTime;
}

// Note: it excludes the unit seconds "ss"
export function convertDateUnitsToString(args: DateUnits) {
	// convert month codes (1 to 12) to zero-indexed (0 to 11)
	const monthIndex = (args.month as number) - 1;
	const datePropsToArr: ArrayThreeOrMore<number>
		= objKeysToArr({ ...args, month: monthIndex }) as ArrayThreeOrMore<number>;
	return (new Date(...datePropsToArr))
		.toISOString()
		.replace(/[^0-9]/g, '')
		.slice(0, -9);
}

export function convertStringToDateUnits(stringifiedDate: string) {
	const year = Number(stringifiedDate.slice(0, 4));
	const month = Number(stringifiedDate.slice(4, 6));
	const day = Number(stringifiedDate.slice(6, 8));
	return { year, month, day };
}