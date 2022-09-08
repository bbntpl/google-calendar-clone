import dayjs, { Dayjs } from 'dayjs';
import {
	CalendarType,
	DateUnits,
} from '../context/global/index.model';
import { hasOnlyDigits, objKeysToArr } from './reusable-funcs';

// array that contains three or more elements
type ArrayThreeOrMore<T> = [T, T, ...T[]];
type AvailableMinutes = '00' | '15' | '30' | '45';
interface DayjsObjByDay {
	date: DateUnits | undefined,
	calendarType: CalendarType,
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

export function convertTZ(date: Date, tzString: string) {
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

export const dayjsObjByDay = ({ date, calendarType, index }: DayjsObjByDay) => {
	const dateFormat = `${date?.year}-${date?.month}-${date?.day}`;
	return calendarType === 'week'
		? dayjs(dateFormat).day(index)
		: dayjs(dateFormat).add(index, 'day');
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

export function getYear(year = dayjs().year()) {
	year = Math.floor(year);
	return Array.from({ length: 12 }, (_, i) => {
		return getMonth(i);
	});
}

export function getDateValues(dateObj: Dayjs, dateFormats: DateFormatting)
	: DateUnits {
	const {
		yearFormat = 'YYYY',
		monthFormat = 'MM',
		dayFormat = 'DD',
	} = dateFormats;
	const year = Number(dateObj.format(yearFormat));
	const month = dateObj.format(monthFormat);
	const day = dateObj.format(dayFormat);
	const numericalYear = Number(dateObj.format(yearFormat));
	const numericalMonth = Number(dateObj.format(monthFormat));
	const numericalDay = Number(dateObj.format(dayFormat));

	// props based on date codes, not zero-indexed
	return {
		year: hasOnlyDigits(year) ? numericalYear : year,
		month: hasOnlyDigits(month) ? numericalMonth : month,
		day: hasOnlyDigits(day) ? numericalDay : day,
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

	// move the last group of items(12AM) in front 
	const lastElementIndex = dayTime.length - 1;
	for (let i = 0; i < minutes.length; i++) {
		dayTime.unshift(dayTime.splice(lastElementIndex, 1)[0]);
	}
	return dayTime;
}

// excluding seconds "ss"
export function stringifyDate(args: DateUnits) {
	// convert month code to zero-indexed 0-11
	const monthIndex = (args.month as number) - 1;
	const datePropsToArr: ArrayThreeOrMore<number>
		= objKeysToArr({ ...args, month: monthIndex }) as ArrayThreeOrMore<number>;
	return (new Date(...datePropsToArr))
		.toISOString()
		.replace(/[^0-9]/g, '')
		.slice(0, -9);
}

export function stringifiedDateToObj(stringifiedDate: string) {
	const year = stringifiedDate.slice(0, 4);
	const month = Number(stringifiedDate.slice(4, 6));
	const day = Number(stringifiedDate.slice(6, 8));
	return { year, month, day };
}