import { DialogArgs } from './index.model';
import React, { forwardRef } from 'react';

import DialogCore from './DialogCore';

type ComponentToPassRef = HTMLDivElement | null;
const DialogOptions = forwardRef<ComponentToPassRef, DialogArgs>((props, ref) => {
	const {
		closeable = true,
		componentProps,
		Component,
		defaultPosition = null,
		// represents change in x or/and y
		delta = { x: 0, y: 0 },
		draggable = true,
		isDialogVisible,
		setIsDialogVisible,
		stylePosition = 'fixed',
	} = props;

	// props to be passed on the dialog component
	const dialogProps = {
		defaultPosition,
		delta,
		draggableProps: {
			handle: '.handle',
		},
		eventHandlers: {
			toggleDialog: () => setIsDialogVisible((visible: boolean) => !visible),
		},
		flags: { draggable, closeable },
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
					: null}
		</>
	)
})

DialogOptions.displayName = 'DialogOptions';

export default DialogOptions;