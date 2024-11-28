import { useEffect, useState } from 'react';
import Page from '../components/page';
import Section from '../components/section';

const Insights = () => {
  // Set up state to store the API result
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the result from the API on component mount
  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: "give me rasons why josh rhee is a good group leader",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setResponse(data.message); // Ensure the backend returns `{ message: string }`
        } else {
          throw new Error('Failed to fetch insights');
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold">Insights</h2>

        <div className="mt-2">
          {loading && <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>}
          {error && <p className="text-red-600 dark:text-red-400">Error: {error}</p>}
          {response && (
            <p className="text-zinc-600 dark:text-zinc-400">
              {response}
            </p>
          )}
        </div>

        <br />

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <a href="https://twosentencestories.com/vision" className="underline">
            oh
          </a>{' '}
          the insights
        </p>
      </Section>
    </Page>
  );
};

export default Insights;
