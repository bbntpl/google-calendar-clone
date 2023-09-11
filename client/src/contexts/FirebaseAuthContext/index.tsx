import {
	useState,
	useEffect,
	createContext,
	useContext,
} from 'react';
import { User } from 'firebase/auth';

import * as FirebaseAuth from './index.model';
import * as GlobalContext from '../index.model';
import { auth } from '../../firebase.config';
import { getLocalStorageNamespace } from '../StoreContext';

const FirebaseAuthContext =
	createContext<FirebaseAuth.ContextState | null>(null);

export default function FirebaseAuthProvider({ children }:
	GlobalContext.ContextProviderProps):
	JSX.Element {
	const [user, setUser] = useState<FirebaseAuth.UserState>('INITIAL');
	const contextValues = { user };

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((newUser) => {
			if (!newUser) {
				const localStorageNamespace = getLocalStorageNamespace();
				localStorage.removeItem(`${localStorageNamespace}_authenticatedUserId`);
				setUser(null);
			} else {
				setUser(newUser);
			}
		});

		return unsubscribe;
	}, []);

	return (
		<FirebaseAuthContext.Provider value={contextValues}>
			{children}
		</FirebaseAuthContext.Provider>
	);
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

export function isInitial(user: FirebaseAuth.UserState): user is 'INITIAL' {
  return user === 'INITIAL';
}


export function isUser(user: FirebaseAuth.UserState): user is User {
  return user !== null && user !== 'INITIAL';
}