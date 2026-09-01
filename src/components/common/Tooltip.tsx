import type { PropsWithChildren } from 'react'

type TooltipProps = PropsWithChildren<{ description: string }>

export function Tooltip({ children, description }: TooltipProps) {
  return <span title={description}>{children}</span>
}
