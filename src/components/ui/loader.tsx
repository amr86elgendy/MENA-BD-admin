import { LoaderIcon } from 'lucide-react'

export function LoaderComponent() {
  return (
    <section className="flex h-[calc(100vh-144px)] w-full items-center justify-center">
      <LoaderIcon className="animate-spin" size={50} />
    </section>
  )
}
