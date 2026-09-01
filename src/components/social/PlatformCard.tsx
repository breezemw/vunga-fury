import { Button } from '../common/Button'
import { Card } from '../common/Card'

type PlatformCardProps = {
  description: string
  isSelected: boolean
  name: string
  onSelect: () => void
}

export function PlatformCard({ description, isSelected, name, onSelect }: PlatformCardProps) {
  return (
    <Card
      className={`p-5 sm:p-6 ${isSelected ? 'border-[var(--accent)]' : ''}`}
      aria-current={isSelected}
    >
      <p className="text-sm font-semibold tracking-[0.08em] text-[var(--heading)]">{name}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      <Button
        type="button"
        variant={isSelected ? 'primary' : 'secondary'}
        className="mt-5 w-full"
        onClick={onSelect}
      >
        {isSelected ? 'SELECTED' : 'SELECT'}
      </Button>
    </Card>
  )
}
