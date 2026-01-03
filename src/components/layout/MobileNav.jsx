import { cn } from '@/lib/utils';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Brain, 
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Receipt, label: 'Expenses', path: '/expenses' },
  { icon: Users, label: 'Groups', path: '/groups' },
  { icon: Brain, label: 'AI', path: '/advisor' },
  { icon: GraduationCap, label: 'Learn', path: '/learn' },
];

export function MobileNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleSettings = () => {
    navigate('/profile');
    setShowMenu(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/login');
      setShowMenu(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex items-center justify-around py-2 px-1 pb-safe">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200',
                    isActive && 'gradient-primary shadow-md'
                  )}>
                    <item.icon className={cn(
                      'w-4 h-4 sm:w-5 sm:h-5',
                      isActive && 'text-primary-foreground'
                    )} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* More Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground"
          >
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200">
              {showMenu ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-medium truncate">More</span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMenu && (
          <div className="absolute bottom-16 right-2 bg-card border border-border rounded-lg shadow-lg z-50 w-48 overflow-hidden">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-b border-border"
            >
              <Settings className="w-4 h-4" />
              Settings & Profile
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Backdrop for menu */}
      {showMenu && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
}
