import Switcher from '../../lib/Switcher';
import { useAppConfigUpdater } from '../../context/AppConfigContext/index';
import UserAuthButton from '../Header/UserAuth/Button';

export default function Header() {
  const { setVisibilities } = useAppConfigUpdater();

  const hideSettingsPanel = () => {
    setVisibilities(prevVisibilities => ({
      ...prevVisibilities,
      settings: false,
    }))
  }

  return <header className='settings-header'>
    <div className='settings-header__inner'>
      <div className='row middle-md'>
        <Switcher
          goPrev={hideSettingsPanel}
        />
        <h1>Configuration Settings</h1>
      </div>
      <UserAuthButton />
    </div>
  </header>
}