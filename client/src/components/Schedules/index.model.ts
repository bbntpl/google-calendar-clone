import { Dispatch, SetStateAction } from 'react';
import {
	Event,
	Task,
} from '../../contexts/StoreContext/types/schedule';

export interface ScheduleStates extends Event, Task { }
export interface ScheduleEventProps {
	eventProps: Omit<Event, 'id' | 'type' | 'title'>;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>;
}

export interface ScheduleTaskProps {
	taskProps: Omit<Task, 'id' | 'type' | 'title'>;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>;
}

export interface Option {
	label: string;
	value: number;
}