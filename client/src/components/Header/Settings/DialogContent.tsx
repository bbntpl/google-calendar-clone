import { useAppConfigUpdater } from '../../../context/AppConfigContext/index';
import { BooleansOnlyObj } from '../../../context/AppConfigContext/index.model';

import { DialogProps } from '../../../lib/Dialog/index.model';

export default function SettingsDialogContent(props: DialogProps) {
  const { setIsDialogVisible } = props;
  const { setVisibilities } = useAppConfigUpdater();
  return (
    <>
      <ul className='dialog__options start-xs'>
        <li>
          <button
            onClick={() => {
              setIsDialogVisible(false);
              setVisibilities((visibilities: BooleansOnlyObj) => ({
                ...visibilities,
                settings: !visibilities.settings,
              }))
            }}
          >
            Settings
          </button>
        </li>
      </ul >
    </>
  )
}