import Link from 'next/link';
import Page from '../../components/page';
import Section from '../../components/section';

const ManageAccount = () => {
  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Manage Account</h2>
        <div className="mt-6 space-y-6">
          {/* Account Information Section */}
          <div className="p-4 bg-zinc-100 rounded-lg shadow-md dark:bg-zinc-800">
            <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-300">Account Information</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Update your account details, such as name, email, or profile picture.
            </p>
            <Link
              href="/settings/account/edit"
              className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Edit Account Details
            </Link>
          </div>

          {/* Change Password Section */}
          <div className="p-4 bg-zinc-100 rounded-lg shadow-md dark:bg-zinc-800">
            <h3 className="text-lg font-medium text-zinc-600 dark:text-zinc-300">Change Password</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Update your password to keep your account secure.
            </p>
            <Link
              href="/settings/account/change-password"
              className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Change Password
            </Link>
          </div>

          {/* Delete Account Section */}
          <div className="p-4 bg-red-100 rounded-lg shadow-md dark:bg-red-800">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-300">Delete Account</h3>
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={() => confirm('Are you sure you want to delete your account?')}
            >
              Delete Account
            </button>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default ManageAccount;
