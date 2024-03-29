import { forwardRef } from 'react';

import { DialogProps } from './index.model';

import DialogCore from './DialogCore';

type ComponentToPassRef = HTMLDivElement | null;

const Dialog = forwardRef<ComponentToPassRef, DialogProps>(
	(props, ref) => {
		const {
			isCloseable = true,
			componentProps = {},
			Component,
			// Represents change in x or/and y
			delta = { x: 0, y: 0 },
			isDraggable = true,
			isDialogVisible,
			isSelfAdjustable = false,
			hasInitTransition = false,
			positionOffset = null,
			setIsDialogVisible,
			stylePosition = 'fixed',
		} = props;

		// The props that'll be passed to the dialog component
		const dialogProps = {
			delta,
			draggableProps: {
				...(!isDraggable && { disabled: true }),
				handle: '.handle',
				...(positionOffset && { positionOffset }),
			},
			eventHandlers: {
				toggleDialog: () => {
					setIsDialogVisible((visible: boolean) => !visible)
				},
			},
			flags: { 
				isDraggable, 
				isCloseable, 
				isSelfAdjustable,
				hasInitTransition, 
			},
			stylePosition,
		}

		const componentPropsWithVisibilityControl = {
			...componentProps,
			isDialogVisible,
			setIsDialogVisible,
		}

		const dialogCoreArgs = {
			Component,
			props: {
				componentProps: componentPropsWithVisibilityControl,
				dialogProps,
			},
		};

		return (
			<>
				{
					isDialogVisible
						? <DialogCore ref={ref} {...dialogCoreArgs} />
						: null
				}
			</>
		)
	})

Dialog.displayName = 'Dialog';
export default Dialog;