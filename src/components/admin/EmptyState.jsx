export function EmptyState({ icon: Icon, title = 'Aucune donnée', description, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-admin-fill flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-admin-muted" />
        </div>
      )}
      <p className="font-semibold text-navy">{title}</p>
      {description && <p className="text-body text-admin-muted mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
