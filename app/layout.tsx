import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import ReactQueryProvider from '@/utils/ReactQueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Landslide Records',
  description: 'A record store in the heart of the city.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-100 text-blue-800 flex flex-col`}>
        <Header />
        <ReactQueryProvider>
          <main className="flex-grow">
            <Container>
              {children}
            </Container>
          </main>
        </ReactQueryProvider>
        <Footer />
      </body>
    </html>
  )
}
