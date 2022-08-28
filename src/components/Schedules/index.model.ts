import { Dispatch, SetStateAction } from 'react';
import {
	DateTimeInputs,
	EventInterface,
	TaskInterface,
} from '../../context/global/index.model';

export interface ScheduleStates extends EventInterface, TaskInterface { }
export interface ScheduleEventProps {
	evtProps: Omit<EventInterface, 'id' | 'type' | 'title'>;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>;
}

export interface DateTimeBlockProps {
	dateTime: DateTimeInputs;
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>;
}

export interface SelectOption {
	label: string;
	id: number;
}