import React from 'react';
import Draggable from 'react-draggable';
import { forwardRef, MutableRefObject, useContext, useEffect, useState } from 'react';
import { DialogCoreArgs } from './index.model';
import './styles.scss';
import '../../styles/main.scss';

import MultiplyIcon from '../../assets/icons/multiply.png';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import usePositionDialog from '../../hooks/usePositionDialog';

const CloseBtn = ({ eventHandler }: { eventHandler: () => void }) => (
	<button className='clear-btn--no-effects close-btn' onClick={eventHandler}>
		<img className='icon--small' src={MultiplyIcon} />
	</button>
);

const DialogCore = forwardRef<HTMLDivElement, DialogCoreArgs>(
	({ Component, props }, ref) => {

		// eslint-disable-next-line react/display-name
		const { componentProps, dialogProps } = props;
		const {
			flags,
			draggableProps,
			eventHandlers,
			stylePosition,
			delta,
			defaultPosition,
		} = dialogProps;
		const { toggleDialog } = eventHandlers;
		const { closeable, draggable } = flags;
		const { handle } = draggableProps;
		const { position } = useContext(GlobalContext) as GlobalContextInterface;
		const [dialogDim, setDialogDim] = useState({ width: 0, height: 0 });
		const cursorPosition = usePositionDialog(position, delta, dialogDim);
		const refCurrent = (ref as MutableRefObject<HTMLDivElement>).current;

		useEffect(() => {
			if (refCurrent) {
				const { clientHeight, clientWidth } = refCurrent;
				setDialogDim(dim => ({ ...dim, width: clientWidth, height: clientHeight }));
			}
		}, [])

		return (
			<Draggable
				handle={handle}
				defaultPosition={defaultPosition || cursorPosition}
				disabled={!draggable}
			>
				<div ref={ref} className={`dialog-inner--${stylePosition}`}>
					{
						(draggable || closeable) &&
						<div className='row middle-xs handle-wrapper'>
							{draggable && <div className={`o-wrapper ${handle.slice(1)}`} />}
							{closeable && <CloseBtn eventHandler={toggleDialog} />}
						</div>
					}
					<div>
						<Component {...componentProps} />
					</div>
				</div>
			</Draggable>
		)
	})

DialogCore.displayName = 'DialogCore';

export default DialogCore;