import { useState } from 'react';
import Page from '../../components/page';
import Section from '../../components/section';

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    personalizedAds: true,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({ ...prev, profileVisibility: e.target.value }));
  };

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Privacy Settings
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your privacy preferences and control how your data is used.
        </p>

        <div className="mt-6 space-y-6">
          {/* Profile Visibility */}
          <div>
            <label
              htmlFor="profileVisibility"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Profile Visibility
            </label>
            <select
              id="profileVisibility"
              value={settings.profileVisibility}
              onChange={handleVisibilityChange}
              className="mt-1 w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Data Sharing */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Share Usage Data
            </span>
            <button
              onClick={() => handleToggle('dataSharing')}
              className={`w-12 h-6 flex items-center rounded-full ${
                settings.dataSharing
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-zinc-400 dark:bg-zinc-600'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  settings.dataSharing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Personalized Ads */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Personalized Ads
            </span>
            <button
              onClick={() => handleToggle('personalizedAds')}
              className={`w-12 h-6 flex items-center rounded-full ${
                settings.personalizedAds
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-zinc-400 dark:bg-zinc-600'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  settings.personalizedAds ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default PrivacySettings;
