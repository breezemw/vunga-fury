import type { PropsWithChildren } from 'react'

type PageContainerProps = PropsWithChildren<{
  className?: string
}>

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>
  )
}
