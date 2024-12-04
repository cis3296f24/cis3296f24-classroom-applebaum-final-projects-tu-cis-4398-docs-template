import { useState } from 'react';
import Page from '../../components/page';
import Section from '../../components/section';

const AccountData = () => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteRequest = () => {
    setIsConfirming(true);
  };

  const handleCancelDelete = () => {
    setIsConfirming(false);
  };

  const handleConfirmDelete = () => {
    setIsConfirming(false);
    // Replace the below alert with the actual delete logic
    alert('Your account data has been deleted.');
  };

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Account Data
        </h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Manage your account data below. You can review or delete your account data if needed. Deleting your data is irreversible.
        </p>

        <div className="mt-6">
          <button
            onClick={handleDeleteRequest}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Delete Account Data
          </button>
        </div>

        {/* Confirmation Dialog */}
        {isConfirming && (
          <div className="mt-6 p-4 bg-zinc-100 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-600">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-500">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete your account data? This action
              cannot be undone.
            </p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-zinc-700 bg-zinc-200 rounded-lg hover:bg-zinc-300 focus:ring-2 focus:ring-zinc-400 dark:text-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Section>
    </Page>
  );
};

export default AccountData;
