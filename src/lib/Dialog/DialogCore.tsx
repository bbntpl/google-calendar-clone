import React, { MutableRefObject, useContext, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { forwardRef } from 'react';
import { WrappedDialogProps } from './index.model';
import './styles.scss';

import MultiplyIcon from '../../assets/icons/multiply.png';
// import GlobalContext from '../../context/global/GlobalContext';
// import GlobalContextInterface from '../../context/global/index.model';
import usePositionDialog from '../../hooks/usePositionDialog';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

const CloseBtn = ({ eventHandler }: { eventHandler: () => void }) => (
	<button className='clear-btn--no-effects close-btn' onClick={eventHandler}>
		<img className='icon--small' src={MultiplyIcon} />
	</button>
);

const DialogCore = forwardRef<HTMLDivElement, WrappedDialogProps>(
	({ Component, props }, ref) => {

		// eslint-disable-next-line react/display-name
		const { componentProps, dialogProps } = props;
		const {
			delta,
			flags,
			draggableProps,
			eventHandlers,
			stylePosition,
		} = dialogProps;
		const { toggleDialog } = eventHandlers;
		const {
			isCloseable,
			isDraggable,
			isSelfAdjustable,
		} = flags;
		const { handle } = draggableProps;
		const {
			position,
		} = useContext(GlobalContext) as GlobalContextInterface;

		// state container for dom rect
		const [rect, setRect] = useState<DOMRect | null>(null);

		// const newPosition = {
		// 	x: rect ? rect.x : 0,
		// 	y: rect ? rect.y : 0,
		// };

		const componentRefSize = {
			width: rect ? rect.width : 0,
			height: rect ? rect.height : 0,
		};

		// auto adjust the position of the component
		// in order to avoid being positioned outside the viewport screen
		const autoAdjustPosition = usePositionDialog(
			componentRefSize,
			position,
			delta,
		);

		useEffect(() => {
			const refCurrent = (ref as MutableRefObject<HTMLDivElement>).current;
			if (refCurrent && !rect) {
				setRect(refCurrent.getBoundingClientRect());
			}
		}, [(ref as MutableRefObject<HTMLDivElement>).current])

		return (
			<Draggable
				{...draggableProps}
				positionOffset={
					isSelfAdjustable ? autoAdjustPosition : draggableProps.positionOffset
				}
			>
				<div ref={ref} className={`dialog-inner--${stylePosition}`}>
					{
						(isDraggable || isCloseable) &&
						<div className='row middle-xs handle-wrapper'>
							{isDraggable && <div className={`o-wrapper ${handle?.slice(1)}`} />}
							{isCloseable && <CloseBtn eventHandler={toggleDialog} />}
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