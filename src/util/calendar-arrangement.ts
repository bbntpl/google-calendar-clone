import dayjs, { Dayjs } from 'dayjs';
import { CalendarType, COLORS, NonOptionalKeys, SelectedDate } from '../context/global/index.model';
import { objKeysToArr } from './reusable-funcs';

type ArrayThreeOrMore<T> = [T, T, ...T[]]
type AvailableMinutes = '00' | '15' | '30' | '45';
interface DayjsObjByDay {
	date: SelectedDate | undefined,
	calendarType: CalendarType,
	index: number,
}
interface DayTimeElement {
	dayPortion: 'AM' | 'PM',
	hour: number,
	hourIndex: number,
	minute: AvailableMinutes,
	time: string
	timeWithoutMinutes: string
}

export const COLOR_NAMES: Array<COLORS>
	= ['raddichio', 'tangerine', 'citron', 'basil', 'blueberry', 'black', 'grafito'];

export function convertTZ(date: Date, tzString: string) {
	return new Date((typeof date === 'string' ? new Date(date) : date)
		.toLocaleString('en-US', { timeZone: tzString }));
}

export const dateToday = {
	year: dayjs().year(),
	month: Number(dayjs().format('M')),
	day: Number(dayjs().format('D')),
};

export const dayjsObj = ({ year, month, day }: SelectedDate) => {
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
	})
}

export function getDateValues(dateObj: Dayjs) {
	const year = Number(dateObj.format('YYYY'));
	const month = Number(dateObj.format('M'));
	const day = Number(dateObj.format('D'));
	// props based on date codes, not zero-indexed
	return { year, month, day }
}

export function getShortDate(dateObj: Dayjs) {
	const year = Number(dateObj.format('YYYY'));
	const month = Number(dateObj.format('MMM'));
	const day = Number(dateObj.format('DD'));
	return `${month} ${day}, ${year}`
}

export function getScheduleTimeOptions() {
	const minutes = ['00', '15', '30', '45'];
	const dayTime: DayTimeElement[] = new Array(96).fill([]).map((_, i) => {
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
	for(let i = 0; i < minutes.length; i++){
		dayTime.unshift(dayTime.splice(lastElementIndex, 1)[0]);
	}

	return dayTime;
}

// excluding seconds "ss"
export function stringifiedDate(args: Record<NonOptionalKeys<SelectedDate>, number>) {
	// convert month code to zero-indexed 0-11
	const monthIndex = args.month - 1;
	const datePropsToArr: ArrayThreeOrMore<number> = objKeysToArr({ ...args, month: monthIndex }) as ArrayThreeOrMore<number>;
	return (new Date(...datePropsToArr))
		.toISOString()
		.replace(/[^0-9]/g, '')
		.slice(0, -9);
}

export function dateObject(stringifiedDate: string) {
	const year = Number(stringifiedDate.slice(0, 3));
	const month = Number(stringifiedDate.slice(4, 5));
	const day = Number(stringifiedDate.slice(6, 7));
	const hours = stringifiedDate.slice(8, 9) || '';
	const minutes = stringifiedDate.slice(10, 11) || '';
	return { year, month, day, hours, minutes };
}