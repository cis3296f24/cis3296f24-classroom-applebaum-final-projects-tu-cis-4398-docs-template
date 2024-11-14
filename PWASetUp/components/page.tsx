import React from 'react'
import Head from 'next/head'
import BottomNav from './bottom-nav'  // Update path if needed

interface Props {
  title?: string;
  children: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="min-h-screen">
      {title && (
        <Head>
          <title>SpeakSense | {title}</title>
        </Head>
      )}
      
      <main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
        <div className='p-6'>{children}</div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Page;