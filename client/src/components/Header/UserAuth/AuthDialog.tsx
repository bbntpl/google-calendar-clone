import ChevronRight from '../../../assets/icons/chevron-right.png';

import { DialogProps } from '../../../lib/Dialog/index.model';

interface AuthDialogContentProps extends DialogProps {
  signOutUser: () => void
  userEmail: string
}

const userInfoStyles = {
  fontSize: '12px',
  width: '200px',
  padding: '6px 10px',
}

export default function AuthDialogContent(props: AuthDialogContentProps) {
  const {
    setIsDialogVisible,
    signOutUser,
    userEmail,
  } = props
  return (
    <>
      <div style={userInfoStyles}>
        {`Signed in 
        as ${userEmail}`}
      </div>
      <ul className='dialog__options start-xs'>
        <li >
          <button
            className='sign-out-btn row middle-md'
            onClick={() => {
              setIsDialogVisible(false);
              signOutUser();
            }}
          >
            <img src={ChevronRight} />
            Sign out from your account
          </button>
        </li>
      </ul >
    </>
  )
}