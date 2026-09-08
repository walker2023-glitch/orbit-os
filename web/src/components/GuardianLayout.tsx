import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const nav = [
  { to: '/guardian', end: true, icon: 'dashboard', label: 'Dashboard' },
  { to: '/guardian/tasks', icon: 'checklist', label: 'Tasks' },
  { to: '/guardian/allowlist', icon: 'security', label: 'Allowlist' },
  { to: '/guardian/activity', icon: 'history', label: 'Activity' },
  { to: '/guardian/proof', icon: 'photo_camera', label: 'Proof Inbox' },
  { to: '/guardian/settings', icon: 'settings', label: 'Settings' },
];

export function GuardianLayout() {
  const { me, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="hidden md:flex flex-col h-full py-olg bg-primary w-[260px] fixed left-0 top-0 border-r border-outline-variant z-20">
        <div className="px-omd mb-oxl">
          <h1 className="text-display-lg text-on-primary">Orbit OS</h1>
          <p className="text-label-md text-on-primary-container mt-oxs">
            The Calm Administrator
          </p>
        </div>

        <div className="flex-1 px-osm space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex items-center px-omd py-osm rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-on-primary font-bold border-l-4 border-secondary-fixed bg-white/10'
                    : 'text-on-primary-container hover:bg-primary-container/50 hover:text-on-primary',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined mr-osm"
                    data-weight={isActive ? 'fill' : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="text-title-lg">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="px-omd mt-auto pt-olg border-t border-outline-variant/20">
          <button
            type="button"
            onClick={() => navigate('/guardian/settings?device=1')}
            className="w-full py-osm bg-secondary text-on-secondary rounded-lg text-label-md hover:bg-secondary/90 transition-colors mb-omd flex items-center justify-center"
          >
            <span className="material-symbols-outlined mr-oxs text-[18px]">add</span>
            Add New Device
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className="flex w-full items-center px-omd py-osm rounded-lg text-on-primary-container hover:bg-primary-container/50 hover:text-on-primary transition-all"
          >
            <span className="material-symbols-outlined mr-osm">logout</span>
            <span className="text-title-lg">Logout</span>
          </button>
        </div>
      </nav>

      <div className="md:ml-[260px] min-h-screen flex flex-col">
        <header className="bg-surface flex justify-between items-center w-full px-gutter md:px-margin-desktop h-16 border-b border-outline-variant z-10 shrink-0">
          <div className="md:hidden">
            <span className="text-headline-md font-bold text-on-background">
              Orbit OS
            </span>
          </div>
          <div className="hidden md:block text-body-md text-on-surface-variant">
            {me?.family_name}
          </div>
          <div className="flex items-center gap-omd">
            <span className="text-body-md text-on-surface-variant hidden sm:inline">
              {me?.email}
            </span>
            <div
              className="w-9 h-9 rounded-[9999px] bg-secondary text-on-secondary flex items-center justify-center text-label-md"
              aria-hidden
            >
              {(me?.email?.[0] ?? 'P').toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-gutter md:p-margin-desktop">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-primary border-t border-outline-variant flex justify-around py-2 z-20">
        {nav.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'text-secondary-fixed' : 'text-on-primary-container'
            }
            aria-label={item.label}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
