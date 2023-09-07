import ExternalCalendars from './ExternalCalendars/index';

export default function SettingsHub() {
  return <div className='settings-main'>
    <div className='settings-sidebar'/>
    <div className='settings-hub'>
      <ExternalCalendars />
    </div>
  </div>
}