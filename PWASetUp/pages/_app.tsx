import type { AppProps } from 'next/app'
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import '../styles/globals.css'

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