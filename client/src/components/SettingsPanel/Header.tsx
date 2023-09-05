import React from 'react';
import Switcher from '../../lib/Switcher';
import { useAppConfigUpdater } from '../../context/AppConfigContext/index';
import UserAuthButton from '../Header/UserAuthButton';

export default function Header() {
  const { setVisibilities } = useAppConfigUpdater();

  const hideSettingsPanel = () => {
    setVisibilities(prevVisibilities => ({
      settings: false,
      ...prevVisibilities,
    }))
  }

  return <header className='header'>
    <div className='header__inner'>
      <div>
        <Switcher
          goPrev={hideSettingsPanel}
        />
        <h1>Configuration Settings</h1>
      </div>
      <UserAuthButton />
    </div>
  </header>
}