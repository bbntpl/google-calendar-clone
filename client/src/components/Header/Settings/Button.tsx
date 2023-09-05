import SettingsIcon from '../../../assets/icons/settings.png';

import Dialog from '../../../lib/Dialog/index';
import useComponentVisible from '../../../hooks/useComponentVisible';
import SettingsDialogContent from './DialogContent';

export default function SettingsButton() {
  const [
    settingsDialogRef,
    isSettingsDialogVisible,
    setIsSettingsDialogVisible,
    linkRef,
  ] = useComponentVisible();

  const settingsDialogContentProps = {
    componentProps: {

    },
    Component: SettingsDialogContent,
    delta: { x: 0, y: 0 },
    isDraggable: false,
    isSelfAdjustable: false,
    hasInitTransition: false,
    positionOffset: { x: 10, y: 50 },
    isDialogVisible: isSettingsDialogVisible,
    setIsDialogVisible: setIsSettingsDialogVisible,
    stylePosition: 'absolute' as const,
  };

  return <div>
    <button
      className='clear-btn--no-effects settings-icon-wrapper'
      ref={linkRef}
    >
      <img className='user-image' src={SettingsIcon} />
    </button>
    <Dialog ref={settingsDialogRef} {...settingsDialogContentProps} />
  </div>
}