import { DialogArgs } from '../../lib/Dialog/index.model';
import { useContext } from 'react';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

export default function ScheduleTypeList(props: DialogArgs) {
	const { setIsDialogVisible } = props;
	const {
		setIsScheduleDialogVisible,
		setSelectedScheduleType,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<>
			<ul className='dialog__options start-xs'>
				<li>
					<button
						onClick={() => {
							setSelectedScheduleType('event');
							setIsDialogVisible(false);
							setIsScheduleDialogVisible(true);
						}}
					>
						Event
					</button>
				</li>
				<li>
					<button onClick={() => {
						setSelectedScheduleType('task');
						setIsDialogVisible(false);
						setIsScheduleDialogVisible(true);
					}}>
						Task
					</button>
				</li>
			</ul>
		</>
	)
}