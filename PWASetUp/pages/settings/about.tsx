import Page from '../../components/page';
import Section from '../../components/section';

const About = () => {
  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          About SpeakSense
        </h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Thank you for uing our app! This was developed by a team of student developers at Temple University. We hope that you are able to use and enjoy your experience.
        </p>

        <div className="mt-6 space-y-4">
          {/* Mission */}
          <div>
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Our Mission
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            We aim to deliver a user-friendly, privacy-focused app that allows you to explore
            your speech and empowers you to take control of your talking habits.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Key Features
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 list-disc pl-6">
              <li>A total running word count</li>
              <li>Key insights on speech patterns</li>
              <li>Responsive design for use on multiple platforms</li>
              <li>Privacy-first approach to protect your data.</li>
              <li>Regular updates with new features and improvements.</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Contact Us
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Have questions or feedback? Reach out to us at{' '}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                support@example.com
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default About;
