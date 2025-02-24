import { createFileRoute } from '@tanstack/react-router'
import { Books } from '@/features/books/components/Books'

export const Route = createFileRoute('/')({
  component: Books
})