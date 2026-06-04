"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import GlobalActions from './GlobalActions';
import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Define admin check (Can be set via Clerk Public Metadata or Environment Variable)
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                  user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
                  true; // Temporarily true so you (the existing user) can see it and test it. Remove 'true' for production.

  const navItems = [
    { name: 'Overview', href: '/', icon: 'dashboard' },
    { name: 'Finance', href: '/finance', icon: 'payments' },
    { name: 'Time', href: '/schedule', icon: 'schedule' },
    { name: 'Health', href: '/health', icon: 'monitoring' },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: 'admin_panel_settings' }] : []),
    { name: 'Pricing', href: '/pricing', icon: 'sell' },
  ];

  return (
    <aside className={`h-screen left-0 top-0 fixed flex flex-col border-r border-outline-variant bg-surface-container-low dark:bg-surface-container-lowest z-50 hidden md:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`px-6 py-8 flex flex-col ${isCollapsed ? 'items-center px-2' : ''}`}>
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <Link href="/" className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface hover:text-primary transition-colors truncate">
              Lumina Edge
            </Link>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 text-on-primary font-bold shadow-lg">
              LE
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex items-center justify-between mt-2">
            <div className="font-label-caps text-label-caps text-outline">Elite Status</div>
            <GlobalActions />
          </div>
        )}
      </div>
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-surface-container-high border border-outline-variant text-on-surface hover:text-primary rounded-full w-6 h-6 flex items-center justify-center shadow-md z-50 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">{isCollapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>
      
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 py-3 rounded-lg font-label-caps text-label-caps transition-all group ${
                isCollapsed ? 'px-0 justify-center w-12 mx-auto relative' : 'px-4'
              } ${
                isActive
                  ? 'text-primary dark:text-primary-fixed bg-surface-container-high ' + (!isCollapsed && 'border-r-2 border-primary')
                  : 'text-on-surface-variant dark:text-outline opacity-70 hover:opacity-100 hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container-highest text-on-surface text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-6 border-t border-outline-variant ${isCollapsed ? 'px-2 flex justify-center' : ''}`}>
        {isLoaded ? (
          isSignedIn ? (
            <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
              <UserButton appearance={{ elements: { userButtonAvatarBox: isCollapsed ? "w-8 h-8" : "w-10 h-10" } }} />
              {!isCollapsed && (
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface truncate max-w-[120px]">{user.fullName || user.firstName || 'USER'}</p>
                  <p className="text-[10px] text-outline uppercase">TIER 01 ANALYST</p>
                </div>
              )}
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className={`py-2 bg-primary/10 text-primary font-label-caps text-label-caps rounded-lg hover:bg-primary/20 transition-all font-bold ${isCollapsed ? 'w-10 h-10 flex items-center justify-center p-0' : 'w-full'}`}>
                {isCollapsed ? <span className="material-symbols-outlined">login</span> : 'SIGN IN'}
              </button>
            </SignInButton>
          )
        ) : (
          <div className="flex items-center gap-3 animate-pulse">
            <div className={`${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-surface-container-highest shrink-0`}></div>
            {!isCollapsed && (
              <div className="space-y-2">
                <div className="h-3 w-20 bg-surface-container-highest rounded"></div>
                <div className="h-2 w-16 bg-surface-container-highest rounded"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
