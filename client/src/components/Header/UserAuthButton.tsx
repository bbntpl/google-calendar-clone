import UserImage from '../../assets/icons/user.png';

export default function UserAuthButton() {
  return <a className='user-image-wrapper row middle-xs center-xs' href='#'>
    <img className='user-image' src={UserImage} />
  </a>
}