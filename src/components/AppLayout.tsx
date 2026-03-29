import { Link, useLocation } from 'react-router-dom';
import { Search, Users, CalendarDays, Plus, LogOut } from 'lucide-react';
import { TreePine } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Search },
  { path: '/families', label: 'Families', icon: Users },
  { path: '/visits', label: 'Visit Log', icon: CalendarDays },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { pandit, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <TreePine className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground leading-none">ई-बहीखाता</h1>
              <p className="text-xs text-muted-foreground">E-Bahikhata</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/families/new"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:opacity-90 transition-opacity ml-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Family</span>
            </Link>

            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
              <span className="text-xs text-muted-foreground hidden md:inline">{pandit?.name || 'Pandit'}</span>
              <button
                onClick={signOut}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
