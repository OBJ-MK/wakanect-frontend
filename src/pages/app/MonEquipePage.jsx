import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getInitials, cn } from '@/lib/utils'

// Mock data — à remplacer par API
const MOCK_EMPLOYEES = [
  { id: '1', name: 'Moussa Sow', phone: '+221 77 555 11 22', accessCount: 5, totalAccess: 8, active: true },
  { id: '2', name: 'Fatou Ba', phone: '+221 77 444 99 00', accessCount: 3, totalAccess: 8, active: false },
]

function EmployeeRow({ emp }) {
  return (
    <Link
      to={`/app/equipe/${emp.id}`}
      className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 last:border-0 hover:bg-white/4 active:bg-white/8 transition-colors"
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold',
        emp.active ? 'bg-white/12 text-white' : 'bg-white/5 text-white/30'
      )}>
        {getInitials(emp.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-body font-semibold', emp.active ? 'text-white' : 'text-white/35')}>
          {emp.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-micro text-white/40 bg-white/6 rounded-full px-2 py-0.5">
            {emp.accessCount}/{emp.totalAccess} accès
          </span>
          <span className="flex items-center gap-1">
            <span className={cn('w-1.5 h-1.5 rounded-full', emp.active ? 'bg-emerald-400' : 'bg-white/20')} />
            <span className={cn('text-micro', emp.active ? 'text-emerald-400' : 'text-white/30')}>
              {emp.active ? 'Actif' : 'Désactivé'}
            </span>
          </span>
        </div>
      </div>
      <ChevronRight size={16} className="text-white/25 shrink-0" />
    </Link>
  )
}

export function MonEquipePage() {
  const { merchant } = useAuthStore()

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app/profil"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Mon équipe</h1>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-4">
        {/* Résumé */}
        <div className="glass rounded-3xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center shrink-0">
            <Users size={22} className="text-white/60" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-h2 text-white">{MOCK_EMPLOYEES.length + 1}</p>
            <p className="text-label text-white/50">
              membres · Toi + {MOCK_EMPLOYEES.length} employé{MOCK_EMPLOYEES.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Propriétaire */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-2 px-1">Propriétaire</p>
          <div className="glass rounded-3xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-amber flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-white">{getInitials(merchant?.owner_name ?? 'W')}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-white">{merchant?.owner_name ?? 'Propriétaire'}</p>
              <p className="text-micro text-white/40">{merchant?.phone ?? ''} · Toi</p>
            </div>
            <span className="text-micro font-semibold text-white/60 border border-white/15 rounded-full px-2.5 py-1 shrink-0">
              Tous les accès
            </span>
          </div>
        </div>

        {/* Employés */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-2 px-1">
            Employés · {MOCK_EMPLOYEES.length}
          </p>
          {MOCK_EMPLOYEES.length === 0 ? (
            <div className="glass rounded-3xl p-10 flex flex-col items-center text-center gap-3">
              <Users size={28} className="text-white/15" />
              <p className="text-body text-white/40">Aucun employé pour l'instant</p>
            </div>
          ) : (
            <div className="glass rounded-3xl overflow-hidden">
              {MOCK_EMPLOYEES.map(emp => <EmployeeRow key={emp.id} emp={emp} />)}
            </div>
          )}
        </div>

        {/* Ajouter */}
        <Link
          to="/app/equipe/ajouter"
          className="flex items-center justify-center gap-2 py-4 rounded-3xl border-2 border-dashed border-white/15 text-white/50 hover:text-white/70 hover:border-white/25 transition-colors font-semibold text-body"
        >
          <Plus size={18} />
          Ajouter un employé
        </Link>
      </div>
    </div>
  )
}
