import { useEffect, useState } from 'react';
import { GoogleAuthProvider, UserCredential, signInWithPopup } from 'firebase/auth';

import UserImage from '../../../assets/icons/user.png';

import { auth } from '../../../firebase.config';
import { isUser, useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import { getLocalStorageNamespace } from '../../../contexts/StoreContext';
import useComponentVisible from '../../../hooks/useComponentVisible';
import {
  doesUserExist,
  saveUserToCloud,
} from '../../../functions/firestore/auth';

import Dialog from '../../../lib/Dialog';
import AuthDialogContent from './AuthDialog';

import { remove, set } from '../../../util/local-storage';
import { FirestoreError } from 'firebase/firestore';

const provider = new GoogleAuthProvider();
auth.useDeviceLanguage();

export default function UserAuth() {
  const user = useFirebaseAuth();
  const [photoSrc, setPhotoSrc] = useState(UserImage);

  const [
    authDialogRef,
    isAuthDialogVisible,
    setIsAuthDialogVisible,
    linkRef,
  ] = useComponentVisible();

  useEffect(() => {
    if (isUser(user) && user.photoURL) {
      setPhotoSrc(user.photoURL);
    }
  }, [user])

  const authDialogContentProps = {
    isCloseable: false,
    componentProps: {
      signOutUser: () => {
        auth.signOut()
          .then(() => {
            setPhotoSrc(UserImage);
            remove(`${getLocalStorageNamespace()}_isUserAuthenticated`);
          })
      },
      userEmail: isUser(user) ? user?.email : null,
    },
    Component: AuthDialogContent,
    delta: { x: 0, y: 0 },
    isDraggable: false,
    isSelfAdjustable: false,
    hasInitTransition: false,
    positionOffset: { x: -180, y: 50 },
    isDialogVisible: isAuthDialogVisible,
    setIsDialogVisible: setIsAuthDialogVisible,
    stylePosition: 'absolute' as const,
  };

  async function handleSignInResult(result: UserCredential) {
    try {
      const isUserUidSaved = await doesUserExist(result.user);
      if (!isUserUidSaved) await saveUserToCloud(result.user);
      if (result.user.photoURL) setPhotoSrc(result.user.photoURL);
      set(`${getLocalStorageNamespace()}_authenticatedUserId`, result.user.uid);
    } catch (e) {
      const error: FirestoreError = e as FirestoreError;
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error && error.customData ? error.customData.email : '';
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log('error code: ', errorCode);
      console.log('error message: ', errorMessage);
      console.log('email: ', email);
      console.log('credential: ', credential);
    }
  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => handleSignInResult(result))
  }

  const handleClick = () => {
    if (user === null) {
      signInWithGoogle();
    } else {
      setIsAuthDialogVisible(prevVisibility => !prevVisibility);
    }
  }

  return <div style={{ position: 'relative' }}>
    <button
      className='clear-btn--no-effects user-image-wrapper row middle-xs center-xs'
      onClick={handleClick}
      ref={linkRef}
    >
      <span>
        <img className='user-image' src={photoSrc} />
      </span>
    </button>
    <Dialog ref={authDialogRef} {...authDialogContentProps} />
  </div>
}