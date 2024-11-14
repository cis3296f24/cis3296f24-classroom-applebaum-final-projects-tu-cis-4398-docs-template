
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';
import * as React from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <NextUIProvider>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
          <Component {...pageProps} />
        </div>
      </NextUIProvider>
    </NextThemesProvider>
  )
}

export default MyApp