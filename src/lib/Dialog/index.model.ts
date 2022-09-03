/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react';
import { DraggableProps } from 'react-draggable';
import { Position } from '../../context/global/index.model';

type CommonTypes = string | number | boolean | null;

interface DialogFlags {
	isDraggable: boolean,
	isCloseable: boolean,
	isSelfAdjustable: boolean,
	hasInitTransition: boolean,
}

interface EventHandlers {
	[key: string]: () => void,
}

export interface DialogViewState {
	isDialogVisible: boolean,
	setIsDialogVisible: Dispatch<SetStateAction<boolean>>,
}

interface ComponentGenericProps {
	[key: string]: CommonTypes | Record<string, any> | any
}

export interface DraggableDialogProps {
	delta: Position,
	draggableProps: Partial<DraggableProps>,
	flags: DialogFlags,
	eventHandlers: EventHandlers,
	stylePosition: string,
}

export interface ComponentWithVisibleControl extends
ComponentGenericProps, DialogViewState { }

interface DialogWithInsertedComponentProps {
	componentProps: ComponentWithVisibleControl,
	dialogProps: DraggableDialogProps,
}

export interface WrappedDialogProps {
	Component: (props: any) => JSX.Element,
	props: DialogWithInsertedComponentProps,
}

export interface DialogProps extends
	DialogViewState, Partial<DialogFlags> {
	componentProps: ComponentGenericProps,
	Component: (props: any) => JSX.Element,
	defaultPosition?: DraggableProps['defaultPosition'],
	delta?: Position,
	positionOffset?: DraggableProps['positionOffset'],
	stylePosition?: 'absolute' | 'fixed' | 'default' | 'centered'
}