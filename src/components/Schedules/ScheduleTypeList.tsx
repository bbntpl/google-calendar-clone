import { DialogArgs } from '../../lib/Dialog/index.model';
import { useContext } from 'react';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

export default function ScheduleDialog(props: DialogArgs) {
	const { setIsDialogVisible } = props;
	const {
		setIsEvtDialogVisible,
		setIsTskDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<>
			<ul className='dialog__options start-xs'>
				<li>
					<button
						onClick={() => {
							setIsDialogVisible(false);
							setIsEvtDialogVisible(true);
						}}
					>
						Event
					</button>
				</li>
				<li>
					<button onClick={() => {
						setIsDialogVisible(false);
						setIsTskDialogVisible(true);
					}}>
						Task
					</button>
				</li>
			</ul>
		</>
	)
}