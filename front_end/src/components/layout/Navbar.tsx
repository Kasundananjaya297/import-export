import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, ShoppingBag, Store } from 'lucide-react';
import LogoFish from '../../assets/LogoFish.png';

const Navbar = () => {
    // Adapt AuthContext to match provided code expectations where possible
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Alias currentUser to user for easier adaptation
    const user = currentUser ? {
        ...currentUser,
        name: currentUser.fname || 'User',
        // Map existing roles to logic if needed, or just use role directly
        // currentMode is not in AuthContext, defaulting to role for display if needed
        currentMode: currentUser.role === 'exporter' ? 'seller' : 'buyer'
    } : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'exporter') return '/exporter/dashboard';
        return '/importer/dashboard'; // Default (buyer/importer)
    };

    // switchMode is not available in current AuthContext. 
    // functionality is disabled/hidden for now.
    const switchMode = () => {
        console.log("Switch mode not implemented in current AuthContext");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
        <>
            <Link to="/fish-pool" onClick={() => mobile && setIsOpen(false)} className={`${mobile ? 'text-lg py-2 text-slate-200 hover:text-cyan-400' : 'text-sm font-medium hover:text-cyan-400'} font-medium transition-colors`}>
                Fish Pool
            </Link>
            <Link to="/about" onClick={() => mobile && setIsOpen(false)} className={`${mobile ? 'text-lg py-2 text-slate-200 hover:text-cyan-400' : 'text-sm font-medium hover:text-cyan-400'} font-medium transition-colors`}>
                About Us
            </Link>
            <Link to="/contact" onClick={() => mobile && setIsOpen(false)} className={`${mobile ? 'text-lg py-2 text-slate-200 hover:text-cyan-400' : 'text-sm font-medium hover:text-cyan-400'} font-medium transition-colors`}>
                Contact Us
            </Link>
            <Link to="/request-species" onClick={() => mobile && setIsOpen(false)} className={`${mobile ? 'text-lg py-2 text-slate-200 hover:text-cyan-400' : 'text-sm font-medium hover:text-cyan-400'} font-medium transition-colors`}>
                Request Species
            </Link>
        </>
    );

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 px-4 py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 z-50 relative">
                    <img
                        src={LogoFish}
                        alt="FishPool Logo"
                        className="w-14 h-14 object-contain"
                    />
                    <span>FishPool</span>
                </Link>

                {/* Desktop Links */}
                <div className="ml-8 hidden md:flex items-center gap-6">
                    <NavLinks />
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" className="text-sm font-medium hover:text-cyan-400 transition-colors">Admin</Link>
                            )}

                            {/* switchMode button hidden as functionality doesn't exist in backend/context yet
                            {user.role !== 'admin' && (
                                <button
                                    onClick={switchMode}
                                    className="flex items-center gap-2 text-sm font-medium glass-card px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    {user.currentMode === 'buyer' ? <ShoppingBag size={16} /> : <Store size={16} />}
                                    <span className="capitalize">{user.currentMode} Mode</span>
                                </button>
                            )}
                            */}

                            <div className="flex items-center gap-3">
                                <Link to={getDashboardLink()} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-cyan-400">
                                    <User size={20} />
                                    <span className="text-sm">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-red-400"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium hover:text-cyan-400 transition-colors">Login</Link>
                            <Link to="/register" className="glass-btn px-4 py-2 rounded-lg text-sm font-medium">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button & Mode */}
                <div className="flex items-center gap-3 md:hidden">
                    {/* Mode switch hidden on mobile too
                    {user && user.role !== 'admin' && (
                        <button
                            onClick={switchMode}
                            className="flex items-center gap-1 text-xs font-bold glass-card px-2 py-1.5 rounded-full"
                        >
                            {user.currentMode === 'buyer' ? <ShoppingBag size={14} className="text-cyan-400" /> : <Store size={14} className="text-purple-400" />}
                            <span className="capitalize">{user.currentMode}</span>
                        </button>
                    )}
                    */}
                    <button onClick={toggleMenu} className="z-[60] relative text-slate-800 p-1">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Sidebar Backdrop */}
                <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    onClick={() => setIsOpen(false)}
                />

                {/* Mobile Sidebar Drawer */}
                <div className={`fixed top-0 right-0 w-full h-full z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-8 gap-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    <div className="flex flex-col items-center gap-6 text-center w-full px-6 py-8 rounded-3xl bg-slate-950/95 border border-white/10 shadow-5xl backdrop-blur-2xl">
                        <NavLinks mobile={true} />

                        <div className="w-full h-px bg-white/10 my-2"></div>

                        {user ? (
                            <div className="flex flex-col gap-6 items-center w-full">
                                <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-medium text-slate-200 hover:text-white">
                                    {user.role === 'admin' ? <User size={20} className="text-cyan-400" /> : <User size={20} />}
                                    {user.name}
                                </Link>

                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-cyan-400 hover:text-cyan-300">Admin Dashboard</Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-4 w-full justify-center py-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <LogOut size={20} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 mt-4 w-full">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-center py-2 text-slate-200 hover:text-white">Login</Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="glass-btn w-full py-3 rounded-xl text-lg font-medium text-center shadow-lg shadow-cyan-500/20 text-white">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
