import { useState } from 'react';
import Page from '../../components/page';
import Section from '../../components/section';

const ReportProblem = () => {
  const [issueType, setIssueType] = useState('bug');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission logic
    console.log({
      issueType,
      description,
    });
    setSubmitted(true);
    setDescription('');
  };

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Report a Problem
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Help us improve by reporting any issues you encounter.
        </p>

        {submitted ? (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md">
            Thank you for your feedback! We’ll look into the issue shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Issue Type Dropdown */}
            <div>
              <label
                htmlFor="issueType"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Type of Issue
              </label>
              <select
                id="issueType"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bug">Bug</option>
                <option value="feedback">Feedback</option>
                <option value="suggestion">Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem in detail..."
                rows={4}
                className="mt-1 w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!description}
            >
              Submit
            </button>
          </form>
        )}
      </Section>
    </Page>
  );
};

export default ReportProblem;
