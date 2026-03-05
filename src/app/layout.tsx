export const metadata = {
  title: 'ToDo App',
  description: 'Next.js ToDo Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
