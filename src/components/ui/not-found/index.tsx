import { Link } from '@tanstack/react-router'
// UI
import { Button } from '../button'

export function NotFound() {
  return (
    <section className='flex h-screen flex-col items-center justify-center space-y-4'>
      <p>This is the notFoundComponent configured on root route</p>
      <Button asChild variant="link" size="lg">
        <Link to="/">Start Over</Link>
      </Button>
    </section>
  )
}
