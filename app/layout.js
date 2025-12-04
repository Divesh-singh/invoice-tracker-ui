
import './globals.css'
import { UserProvider } from '../context/UserContext'
import Header from '../components/Header'

export const metadata = {
  title: 'Invoice Tracker'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
