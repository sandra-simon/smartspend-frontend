
import type { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  badge: string
  iconColor: string
  iconBackground: string
  badgeColor: string
  glowColor: string
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
  iconColor,
  iconBackground,
  badgeColor,
  glowColor,
}: FeatureCardProps) {
  return (
    <article className="relative isolate overflow-hidden rounded-card border border-border bg-surface p-6 shadow-card transition-shadow duration-200 hover:shadow-elevated sm:p-8">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-16 -right-10 -z-10 h-40 w-40 rounded-full ${glowColor} blur-3xl`}
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-control ${iconBackground} ${iconColor}`}
        >
          {icon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-center text-xs font-bold uppercase tracking-wide ${badgeColor}`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-7">
        <h3 className="text-card-title font-bold text-brand">{title}</h3>

        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {description}
        </p>
      </div>
    </article>
  )
}

export default FeatureCard
