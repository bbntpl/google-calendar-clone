import React, {
	createContext,
	useContext,
	useState,
} from 'react';

import useCursorPosition from '../../hooks/useCursorPosition';

import { ContextProviderProps } from '../index.model';
import * as AppConfigModel from './index.model';

const AppConfigContext
	= createContext<AppConfigModel.ContextState | null>(null)

const AppConfigDispatchContext
	= createContext<AppConfigModel.DispatchContextState | null>(null)

export default function AppConfigProvider({ children }: ContextProviderProps):
	JSX.Element {
	const { position, recordPosition } = useCursorPosition();
	const [visibilities, setVisibilities]
		= useState<AppConfigModel.BooleansOnlyObj>({
			sidebar: true,
			labels: true,
			settings: false,
		});

	const contextValues: AppConfigModel.ContextState = {
		position,
		visibilities,
	}

	const dispatchContextValues: AppConfigModel.DispatchContextState = {
		recordPosition,
		setVisibilities,
	}

	return (
		<AppConfigContext.Provider value={contextValues}>
			<AppConfigDispatchContext.Provider value={dispatchContextValues}>
				{children}
			</AppConfigDispatchContext.Provider>
		</AppConfigContext.Provider>
	)
}

export function useAppConfig() {
	const context =  useContext(AppConfigContext);
	if (!context) {
		throw new Error('useAppConfig must be used within an AppCOnfigProvider');
	}

	return context;
}

export function useAppConfigUpdater() {
	const context =  useContext(AppConfigDispatchContext);
	if (!context) {
		throw new Error('useAppConfigUpdater must be used within an AppConfigProvider');
	}

	return context;
}