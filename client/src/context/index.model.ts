import {
	Dispatch,
	ReactNode,
	SetStateAction,
} from 'react';

export interface ContextProviderProps {
	children: ReactNode
}

export type NonOptionalKeys<T> = {
	[k in keyof T]-?: undefined extends T[k] ? never : k
}[keyof T];
export declare type SetState<T> = Dispatch<SetStateAction<T>>;
export interface Position {
	x: number;
	y: number;
}
export type ElementsToRef = HTMLDivElement;

type DateUnitKeys = 'year' | 'month' | 'day';
type TimeUnitKeys = 'hours' | 'minutes' | 'timezone';
type FullDateComponentKeys = DateUnitKeys | TimeUnitKeys;
export type FullDateUnits = { [key in FullDateComponentKeys]: number | string }

export interface Notification {
	minute: number;
	scheduleId: number;
}