import React from 'react'
import Head from 'next/head'

import BottomNav from './bottom-nav'
import Appbar from './appbar'


interface Props {
  title?: string;
  children: React.ReactNode;
}

const Page = ({ title, children }: Props) => (
	<>
		{title ? (
			<Head>
				<title>SpeakSense | {title}</title>
			</Head>
		) : null}
		<Appbar />
		<main
			/**
			 * Padding top = `appbar` height
			 * Padding bottom = `bottom-nav` height
			 */
			className='mx-auto max-w-screen-md pt-5 pb-16 px-safe sm:pb-0'
		>
			<div className='p-6'>{children}</div>
		</main>
		<BottomNav />
	</>
)

export default Page
