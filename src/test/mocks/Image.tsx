import React from 'react'

export function Image({ alt, className }: { alt: string; className?: string }) {
  return <div data-testid="mock-image" className={className} aria-label={alt} />
}