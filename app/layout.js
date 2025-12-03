import '../styles/globals.css'

export const metadata = {
  title: 'Invoice Tracker'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
