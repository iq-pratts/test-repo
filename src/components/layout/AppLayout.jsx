import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AppLayout({ children }) { {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
}