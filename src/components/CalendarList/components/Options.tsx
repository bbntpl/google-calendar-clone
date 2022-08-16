import { COLORS, UserActionType } from '../../../context/global/index.model';
import { EventHandlers, WrappedComponentProps } from '../index.model';

import '../styles.scss';
import CheckIcon from '../../../assets/icons/check.png';

const COLOR_NAMES: Array<COLORS> = ['raddichio', 'tangerine', 'citron', 'basil', 'blueberry', 'black', 'grafito'];

export default function Options(props: WrappedComponentProps) {
	const { 
		flags, 
		calendarProps, 
		globalContextProps, 
		setIsModalVisible, 
		eventHandlers = {} as EventHandlers, 
	} = props;
	const { options, colors } = flags;
	const { calendarList, dispatchCalendarList } = globalContextProps;

	const handleChange = (color: COLORS) => {
		// update the context if the received calendar props has id
		if (calendarProps.id && Object.keys(eventHandlers).length === 0) {
			dispatchCalendarList({
				type: UserActionType.EDIT,
				payload: { id: calendarProps.id, color },
			});
			return;
		}
		// changing the color prop from the state of the parent
		eventHandlers.handleColorChange?.(color);
	}

	const unselectAllExceptMatchedId = () => {
		calendarList.forEach((calendar) => {
			const { id: calendarId } = calendar;
			dispatchCalendarList({
				type: UserActionType.EDIT,
				payload: {
					id: calendarId,
					selected: calendarId === calendarProps.id,
				},
			})
		});
		setIsModalVisible(visible => !visible);
	}

	return (
		<div className='modal-calendar'>
			<ul className='modal__options start-xs'>
				{
					options
						? <li>
							<button
								className='o-wrapper'
								onClick={unselectAllExceptMatchedId}
							>
								Only show this calendar
							</button>
						</li>
						: null
				}
			</ul>
			{
				colors ?
					<div className='o-wrapper modal-calendar__colors-container'>
						{COLOR_NAMES.map((color, index) => {
							const { color: selectedColor } = calendarProps;
							return (
								<button
									className={`${color} rounded-color clear-btn`}
									key={`color-${index}`}
									color={calendarProps.color}
									onClick={() => handleChange(color)}
								>
									{
										color === selectedColor
											? <div>
												<img className='status--checked' src={CheckIcon} />
											</div>
											: null
									}
								</button>)
						})}
					</div> : null
			}
		</div>
	)
}