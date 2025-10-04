import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useUser, useAuthActions } from '../stores/authStore';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5h10a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
    </svg>
);

const UserMenu: React.FC = () => {
    const user = useUser();
    const { logout } = useAuthActions();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        showToast(t('auth.logout_success'), 'success');
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                 <img src={user.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.fullName || user.email}`} alt="User Avatar" className="w-full h-full object-cover" />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 w-48 bg-card rounded-md shadow-lg border z-20">
                    <div className="p-2 border-b">
                        <p className="font-semibold text-sm truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <ul className="p-1">
                        <li>
                            <NavLink to={`/u/${user.username || 'me'}`} className="flex items-center w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                                <UserIcon />
                                <span className="ml-2 rtl:mr-2">{t('header.userMenu.viewProfile')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/wallet" className="flex items-center w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                                <WalletIcon />
                                <span className="ml-2 rtl:mr-2">{t('header.userMenu.myWallet')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-destructive">
                                <LogoutIcon />
                                <span className="ml-2 rtl:mr-2">{t('header.userMenu.logout')}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<{ showLogin?: boolean }> = ({ showLogin = false }) => {
  const { locale, setLocale, t } = useI18n();
  const user = useUser();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-100 text-primary' : 'text-gray-600 hover:bg-gray-50'
    }`;


  return (
    <header className="p-4 border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h1 className="text-2xl font-bold text-primary">{t('appName')}</h1>
            {user && (
                <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
                    <NavLink to="/dashboard" className={navLinkClass}>{t('header.dashboard')}</NavLink>
                    <NavLink to="/feed" className={navLinkClass}>{t('header.feed')}</NavLink>
                    <NavLink to="/deals" className={navLinkClass}>{t('header.deals')}</NavLink>
                    <NavLink to="/jobs" className={navLinkClass}>{t('header.jobs')}</NavLink>
                    <NavLink to="/match" className={navLinkClass}>{t('header.match')}</NavLink>
                    <NavLink to="/messages" className={navLinkClass}>{t('header.messages')}</NavLink>
                </nav>
            )}
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button onClick={toggleLocale} variant="ghost" size="sm">
            {locale === 'en' ? t('header.language.ar') : t('header.language.en')}
          </Button>
          {showLogin && <Link to="/"><Button variant="outline" size="sm">{t('header.login')}</Button></Link>}
          {user && <UserMenu />}
        </div>
      </div>
    </header>
  );
};