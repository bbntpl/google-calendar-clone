import React, {
	useState,
	useEffect,
	createContext,
	useContext,
} from 'react';

import * as FirebaseAuth from './index.model';
import * as GlobalContext from '../index.model';
import { auth } from '../../firebase';

const FirebaseAuthContext =
	createContext<FirebaseAuth.ContextState | null>(null);

export default function FirebaseAuthProvider({ children }:
	GlobalContext.ContextProviderProps):
	JSX.Element {
	const [user, setUser] = useState<FirebaseAuth.User | null>(null);
	const contextValues = { user };

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(setUser);
		return unsubscribe;
	}, []);

	return (
		<FirebaseAuthContext.Provider value={contextValues} >
			{children}
		</FirebaseAuthContext.Provider>
	)
};

export function useFirebaseAuth() {
	const context = useContext(FirebaseAuthContext);
	if (context === null) {
		throw new Error(
			'useFirebaseAuth must be used within a FirebaseAuthProvider',
		);
	}
	return context.user;
}