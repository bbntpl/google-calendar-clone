import UserImage from '../../../assets/icons/user.png';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useFirebaseAuth } from '../../../context/FirebaseAuthContext';
import useComponentVisible from '../../../hooks/useComponentVisible';

import Dialog from '../../../lib/Dialog';
import AuthDialogContent from './AuthDialog';
import { useState } from 'react';

const provider = new GoogleAuthProvider();
auth.useDeviceLanguage();

export default function UserAuthButton() {
  const user = useFirebaseAuth();
  const [photoSrc, setPhotoSrc] = useState(
    user && user.photoURL ? user.photoURL : UserImage,
  );

  const [
    authDialogRef,
    isAuthDialogVisible,
    setIsAuthDialogVisible,
    linkRef,
  ] = useComponentVisible();

  const authDialogContentProps = {
    isCloseable: false,
    componentProps: {
      signOutUser: () => {
        auth.signOut()
          .then(() => {
            setPhotoSrc(UserImage);
          })
      },
      userEmail: user?.email,
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

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        if (result && result.user.photoURL) {
          setPhotoSrc(result.user.photoURL);
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        // The signed-in user info.

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log('error code: ', errorCode);
        console.log('error message: ', errorMessage);
        console.log('email: ', email);
        console.log('credential: ', credential);
      });
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