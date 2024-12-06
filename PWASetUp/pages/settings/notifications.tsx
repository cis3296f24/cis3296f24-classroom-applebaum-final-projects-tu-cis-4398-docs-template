import { useState } from 'react';
import Page from '../../components/page';
import Section from '../../components/section';

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState(3);

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Notification Preferences
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage how and when you receive notifications.
        </p>

        <div className="mt-6 space-y-4">
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Notifications
            </label>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                emailNotifications ? 'bg-blue-600' : 'bg-zinc-400'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* SMS Notifications Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              SMS Notifications
            </label>
            <button
              onClick={() => setSmsNotifications(!smsNotifications)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                smsNotifications ? 'bg-blue-600' : 'bg-zinc-400'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform ${
                  smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Push Notifications
            </label>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                pushNotifications ? 'bg-blue-600' : 'bg-zinc-400'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default NotificationSettings;
