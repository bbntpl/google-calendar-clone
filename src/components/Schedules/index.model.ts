import { Dispatch, SetStateAction } from 'react';
import { 
	DateTimeInputInterface, 
	EventInterface, 
	TaskInterface, 
} from '../../context/global/index.model';

export interface ScheduleStates extends EventInterface, TaskInterface { }
export interface ScheduleEventProps {
	evtProps: Omit<EventInterface, 'id' | 'type' | 'title'>,
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>,
}

export interface DateTimeInputsProps {
	dateTime: DateTimeInputInterface,
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>
}