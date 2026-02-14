import { redirect } from 'next/navigation'
import { authOptions } from '../../lib/AuthOptions'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { FaLayerGroup, FaMapMarkerAlt, FaCog, FaArrowRight } from 'react-icons/fa'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  const cards = [
    {
      href: '/clusters',
      icon: FaLayerGroup,
      title: 'Cluster View',
      description: 'Visualize dense incident regions with grouped markers and smart clustering',
      gradient: 'from-brand-500 to-brand-700',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.3)]',
      iconBg: 'bg-brand-500/10',
      iconColor: 'text-brand-600',
    },
    {
      href: '/locations',
      icon: FaMapMarkerAlt,
      title: 'Location View',
      description: 'Browse individual markers for every recorded landslide incident across India',
      gradient: 'from-accent-sky to-brand-500',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(14,165,233,0.3)]',
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-600',
    },
    {
      href: '/admin',
      icon: FaCog,
      title: 'Admin Panel',
      description: 'Manage records, approve entries, and configure system settings',
      gradient: 'from-surface-600 to-surface-800',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(71,85,105,0.25)]',
      iconBg: 'bg-surface-500/10',
      iconColor: 'text-surface-600',
    },
  ]

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-100 rounded-full mb-5">
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-xs font-semibold text-brand-600 tracking-wide">DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-800 mb-3">
            Welcome back, <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">{session.user?.name || session.user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-surface-400 text-base max-w-lg mx-auto">
            Explore landslide data through interactive maps, manage records, and gain insights from the disaster inventory.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className={`group relative bg-white rounded-2xl border border-surface-100 p-6
                transition-all duration-300 hover:-translate-y-1 cursor-pointer ${card.glow} shadow-card hover:shadow-card-hover`}>
                {/* Top gradient line */}
                <div className={`absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r ${card.gradient} rounded-b-full
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`text-xl ${card.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-surface-800 mb-1.5">{card.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed mb-4">{card.description}</p>

                {/* Arrow */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-500
                  group-hover:text-brand-600 transition-colors">
                  <span>Open</span>
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        {/* <div className="mt-10 flex items-center justify-center">
          <div className="flex items-center gap-6 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-surface-100 shadow-card">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <FaMapMarkerAlt className="text-brand-500 text-xs" />
              </div>
              <div>
                <div className="text-[10px] text-surface-400 font-medium uppercase">Map Views</div>
                <div className="text-sm font-bold text-surface-700">2 Available</div>
              </div>
            </div>
            <div className="w-px h-8 bg-surface-100" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent-emerald" />
              </div>
              <div>
                <div className="text-[10px] text-surface-400 font-medium uppercase">Status</div>
                <div className="text-sm font-bold text-accent-emerald">Online</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
