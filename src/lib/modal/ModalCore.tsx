import Draggable from 'react-draggable';
import { forwardRef, MutableRefObject, useContext, useEffect, useState } from 'react';
import { ModalCoreArgs } from './index.model';
import './styles.scss';
import '../../styles/main.scss';

import MultiplyIcon from '../../assets/icons/multiply.png';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import usePositionModal from '../../hooks/usePositionModal';

const CloseBtn = ({ eventHandler }: { eventHandler: () => void }) => (
	<button className='clear-btn--no-effects close-btn' onClick={eventHandler}>
		<img className='icon--small' src={MultiplyIcon} />
	</button>
);

const ModalCore = forwardRef<HTMLDivElement, ModalCoreArgs>(
	({ Component, props }, ref) => {

		// eslint-disable-next-line react/display-name
		const { componentProps, modalProps } = props;
		const {
			flags,
			draggableProps,
			eventHandlers,
			stylePosition,
			delta,
			defaultPosition,
		} = modalProps;
		const { toggleModal } = eventHandlers;
		const { closeable, draggable } = flags;
		const { handle } = draggableProps;
		const { position } = useContext(GlobalContext) as GlobalContextInterface;
		const [modalDim, setModalDim] = useState({ width: 0, height: 0 });
		const cursorPosition = usePositionModal(position, delta, modalDim);
		const refCurrent = (ref as MutableRefObject<HTMLDivElement>).current;

		useEffect(() => {
			if (refCurrent) {
				const { clientHeight, clientWidth } = refCurrent;
				setModalDim(dim => ({ ...dim, width: clientWidth, height: clientHeight }));
			}
		}, [])

		return (
			<Draggable
				handle={handle}
				defaultPosition={defaultPosition || cursorPosition}
				disabled={!draggable}
			>
				<div ref={ref} className={`modal-inner--${stylePosition}`}>
					{
						(draggable || closeable) &&
						<div className='row middle-xs handle-wrapper'>
							{draggable && <div className={`o-wrapper ${handle.slice(1)}`} />}
							{closeable && <CloseBtn eventHandler={toggleModal} />}
						</div>
					}
					<div>
						<Component {...componentProps} />
					</div>
				</div>
			</Draggable>
		)
	})

ModalCore.displayName = 'ModalCore';

export default ModalCore;