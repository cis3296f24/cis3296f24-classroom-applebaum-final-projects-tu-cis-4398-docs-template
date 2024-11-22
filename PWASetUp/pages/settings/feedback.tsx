import Page from '../../components/page';
import Section from '../../components/section';

const Feedback = () => {
  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Feedback</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Your feedback is valuable to us. Please fill out the form below to let us know your thoughts or report any issues.
        </p>
        <form className="mt-6 space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full mt-1 px-4 py-2 text-zinc-700 bg-white border border-zinc-300 rounded-lg shadow-sm dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full mt-1 px-4 py-2 text-zinc-700 bg-white border border-zinc-300 rounded-lg shadow-sm dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Email"
              required
            />
          </div>

          {/* Feedback Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="block w-full mt-1 px-4 py-2 text-zinc-700 bg-white border border-zinc-300 rounded-lg shadow-sm dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your feedback here..."
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </Section>
    </Page>
  );
};

export default Feedback;
