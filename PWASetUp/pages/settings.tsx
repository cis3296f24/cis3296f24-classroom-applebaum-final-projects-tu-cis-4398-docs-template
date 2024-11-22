import Link from 'next/link';
import Page from '../components/page';
import Section from '../components/section';
import {UserCircleIcon, BellIcon, ChatBubbleOvalLeftEllipsisIcon, StarIcon, LockClosedIcon, ExclamationCircleIcon, QuestionMarkCircleIcon, ShareIcon, ShieldExclamationIcon, AcademicCapIcon} from "@heroicons/react/24/solid";

const Settings = () => {
  const settingsSections = [
    {
      title: 'Account Settings',
      links: [{ href: '/settings/account', label: 'Manage Account', icon: <UserCircleIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />, }],
    },
    {
      title: 'Feedback & Support',
      links: [
        { href: '/settings/feedback', label: 'Feedback', icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />},
        { href: '/settings/help', label: 'Help', icon: <QuestionMarkCircleIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />, },
        { href: '/settings/report', label: 'Report a Problem', icon: <ExclamationCircleIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />, },
      ],
    },
    {
      title: 'Privacy & Notifications',
      links: [
        { href: '/settings/notifications', label: 'Notification Preferences', icon: <BellIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />,},
        { href: '/settings/privacy', label: 'Privacy Settings' , icon: <ShieldExclamationIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />,},
      ],
    },
    {
      title: 'App Information',
      links: [
        { href: '/settings/about', label: 'About', icon: <AcademicCapIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />, },
        { href: '/settings/rate', label: 'Rate the App', icon: <StarIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />,},
        { href: '/settings/share', label: 'Share', icon: <ShareIcon className="w-6 h-6 text-zinc-500 dark:text-zinc-300" />, },
      ],
    },
  ];

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold">Settings</h2>
        {settingsSections.map((section) => (
          <div key={section.title} className="mt-6">
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {section.title}
            </h3>
            <ul className="mt-2 space-y-2">
              {section.links.map(({ href, label, icon}) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-lg font-medium text-zinc-600 bg-zinc-100 rounded-lg shadow-sm hover:bg-zinc-200 dark:text-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  >
					{icon && <span>{icon}</span>}
					<span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </Page>
  );
};

export default Settings;
