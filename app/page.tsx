import { redirect } from 'next/navigation'

export default function HomePage() {
  // Temporal redirect al dashboard
  redirect('/contacts')
}

