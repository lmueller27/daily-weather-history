import './styles/globals.css'
import { Barlow, Montserrat, Roboto } from 'next/font/google'
import styles from './styles/layout.module.css';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const metadata = {
  title: 'Daily Weather History',
  description: 'Visualize and compare historical weather data for any geolocation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={styles.container} lang="en">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  )
}
