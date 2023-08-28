import { useState, useContext, useEffect} from 'react';

import GlobalContextInterface, {
	UserActionType,
	CalendarLabelType,
} from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';
import { uniqueID } from '../../util/reusable-funcs';
import { defaultColorOption } from '../../themes/data';

import './styles.scss';
import ChevronBottom from '../../assets/icons/chevron-bottom.png';
import ChevronUp from '../../assets/icons/chevron-up.png';
import PlusIcon from '../../assets/icons/plus.png';

import NewCalendar from './NewCalendar';
import LabelList from './LabelList';

export default function CalendarList(): JSX.Element {
	const { 
		calendarList, 
		dispatchCalendarList, 
		savedSchedules, 
		recordPos, 
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [showAddLblBtn, setShowAddLblBtn] = useState(false);

	const handleToggleAccordion = () => setIsCollapsed(isCollapsed => !isCollapsed);
	const handleToggleInput = (e: { stopPropagation: () => void; }) => {
		e.stopPropagation();
		setShowAddLblBtn(toggle => !toggle);
	}
	
	// Add/remove calendars depending on existence of a schedule by type
	useEffect(() => {
		const areThereTasks = savedSchedules.some(schedule => schedule.type === 'task');
		const areThereEvents = savedSchedules.some(schedule => schedule.type === 'event');

		const taskCalendar = calendarList.filter((calendar) => calendar.name === 'Tasks');
		const evtCalendar = calendarList.filter((calendar) => calendar.name === 'Events');

		type InitialCalendarLabelProps = Omit<CalendarLabelType, 'name'>;
		const calendarLblProps: InitialCalendarLabelProps = {
			id: uniqueID(),
			colorOption: defaultColorOption,
			removable: false,
			selected: false,
		};
		if (!areThereTasks && taskCalendar.length) {
			dispatchCalendarList({ type: UserActionType.REMOVE, payload: taskCalendar[0].id });
		} else if (!areThereEvents && evtCalendar.length) {
			dispatchCalendarList({ type: UserActionType.REMOVE, payload: evtCalendar[0].id });
		} else if (areThereTasks && !taskCalendar) {
			dispatchCalendarList({
				type: UserActionType.ADD, payload: Object.assign({}, calendarLblProps, { name: 'Tasks' }),
			});
		} else if (areThereEvents && !evtCalendar) {
			dispatchCalendarList({
				type: UserActionType.ADD, payload: Object.assign({}, calendarLblProps, { name: 'Events' }),
			});
		}
	}, [calendarList, savedSchedules]);

	return (
		<div className='accordion-container'>
			<div className='accordion col'>
				<div
					className='accordion__toggler row middle-xs'
					onClick={() => {
						setShowAddLblBtn(false);
						handleToggleAccordion();
					}}>
					<h5 className='row'>{`My Calendars ${calendarList.length}/10`}</h5>
					<span className='row end-xs middle-xs'>
						<button
							className='clear-btn--no-effects'
							onClick={handleToggleInput}
						>
							<img className='icon--medium' src={PlusIcon} />
						</button>
						<img src={isCollapsed ? ChevronUp : ChevronBottom} />
					</span>
				</div>
				<ul className={`accordion__panel ${isCollapsed ? 'show' : 'hide'}`}>
					<LabelList
						calendarList={calendarList}
						dispatchCalendarList={dispatchCalendarList}
						recordPos={recordPos}
					/>
					{
						showAddLblBtn
							? <NewCalendar
								setShowAddLblBtn={setShowAddLblBtn}
								dispatchCalendarList={dispatchCalendarList}
								calendarList={calendarList}
								recordPos={recordPos}
							/>
							: null
					}
				</ul>
			</div>
		</div>
	)
}