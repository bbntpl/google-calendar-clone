import { ModalArgs } from '../../lib/modal/index.model';
import { useContext } from 'react';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

export default function ScheduleModal(props: ModalArgs) {
	const { setIsModalVisible } = props;
	const {
		setIsEvtModalVisible,
		setIsTskModalVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<>
			<ul className='modal__options start-xs'>
				<li>
					<button
						onClick={() => {
							setIsModalVisible(false);
							setIsEvtModalVisible(true);
						}}
					>
						Event
					</button>
				</li>
				<li>
					<button onClick={() => {
						setIsModalVisible(false);
						setIsTskModalVisible(true);
					}}>
						Task
					</button>
				</li>
			</ul>
		</>
	)
}