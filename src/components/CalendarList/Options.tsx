import { UserActionType } from '../../context/global/index.model';
import { EventHandlers, WrappedComponentProps } from './index.model';

import './styles.scss';
import CheckIcon from '../../assets/icons/check.png';
import { ColorOption, colorOptions } from '../../themes/data';

export default function Options(props: WrappedComponentProps) {
	const {
		flags,
		calendarProps,
		globalContextProps,
		setIsDialogVisible,
		eventHandlers = {} as EventHandlers,
	} = props;
	const { options, colors } = flags;
	const { calendarList, dispatchCalendarList } = globalContextProps;

	const handleChange = (colorOption: ColorOption) => {
		// Update the context if the received calendar props has id
		if (calendarProps.id && Object.keys(eventHandlers).length === 0) {
			dispatchCalendarList({
				type: UserActionType.EDIT,
				payload: { ...calendarProps, colorOption },
			});
			return;
		}
		// Changing the color prop from the state of the parent
		eventHandlers.handleColorChange?.(colorOption);
	}

	const unselectAllExceptMatchedId = () => {
		calendarList.forEach((calendar) => {
			const { id: calendarId } = calendar;
			dispatchCalendarList({
				type: UserActionType.EDIT,
				payload: {
					...calendarProps,
					id: calendarId,
					selected: calendarId === calendarProps.id,
				},
			})
		});
		setIsDialogVisible(visible => !visible);
	}

	return (
		<div className='dialog-calendar'>
			<ul className='dialog__options start-xs'>
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
					<div className='o-wrapper color-selection'>
						{colorOptions.map((colorOption) => {
							const { color, value } = colorOption;
							const { colorOption: selectedColorOption } = calendarProps;
							const { color: selectedColor } = selectedColorOption
							return (
								<button
									className='rounded-color clear-btn'
									key={`color-${color}`}
									onClick={() => handleChange(colorOption)}
									style={{ backgroundColor: value }}
								>
									{
										color === selectedColor
										&& <div>
											<img className='status--checked' src={CheckIcon} />
										</div>
									}
								</button>)
						})}
					</div> : null
			}
		</div>
	)
}