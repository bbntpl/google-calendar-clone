import { Dispatch, SetStateAction } from 'react';
import { EventInterface, TaskInterface } from '../../context/global/index.model';

interface ScheduleStates extends EventInterface, TaskInterface { }
export interface ScheduleEventProps {
	evtProps: Omit<EventInterface, 'id' | 'type' | 'title'>,
	setScheduleProps: Dispatch<SetStateAction<ScheduleStates>>,
}