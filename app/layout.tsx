import './globals.css'
import { Roboto } from 'next/font/google'
import styles from './layout.module.css';
import Navbar from './components/navbar';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const metadata = {
  title: 'ITHTU?',
  description: 'Compare historical temperatures',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={styles.container} lang="en">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  )
}
