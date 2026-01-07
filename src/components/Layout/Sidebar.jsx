import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [openMenus, setOpenMenus] = useState({
        books: false,
        categories: false,
        orders: false,
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const isActive = (path) => location.pathname === path;
    const isMenuActive = (paths) => paths.some(path => location.pathname.startsWith(path));

    return (
        <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
            {/* Brand/Logo Section */}
            {/* <Link to="/" className="p-6 border-b border-gray-800 hover:bg-gray-800 transition">
                <div className="flex items-center space-x-3">
                    <img 
                        src="/download.png" 
                        alt="Logo" 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-xl font-bold">ADMIN</span>
                </div>
            </Link> */}

            {/* User Panel */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <img 
                        src="/jong an.png" 
                        alt="User" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-800">
                <div className="relative">
                    <input 
                        type="search" 
                        placeholder="Search..." 
                        className="w-full px-3 py-2 pl-10 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                    {/* Dashboard */}
                    <li>
                        <Link
                            to="/"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                                isActive('/')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <i className="fas fa-tachometer-alt text-lg"></i>
                            <span className="font-medium">Dashboard</span>
                        </Link>
                    </li>

                    {/* Management Section Header */}
                    <li className="pt-4 pb-2">
                        <span className="px-4 text-xs font-semibold text-gray-500 uppercase">
                            Management
                        </span>
                    </li>

                    {/* Books Menu (Expandable) */}
                    <li>
                        <Link
                            to="/books/list"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                                isActive('/books/list')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <i className="fas fa-book text-lg"></i>
                            <span className="font-medium">Book</span>
                        </Link>
                    </li>
                        
                        
                        
                                    
                    {/* Categories Menu (Expandable) */}
                    <li>
                        <button
                            onClick={() => toggleMenu('categories')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition duration-200 ${
                                isMenuActive(['/categories'])
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <i className="fas fa-folder text-lg"></i>
                                <span className="font-medium">Categories</span>
                            </div>
                            <i className={`fas fa-chevron-right transform transition-transform ${openMenus.categories ? 'rotate-90' : ''}`}></i>
                        </button>
                        
                        {/* Categories Submenu */}
                        {openMenus.categories && (
                            <ul className="mt-1 ml-4 space-y-1">
                                <li>
                                    <Link
                                        to="/categories"
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                                            isActive('/categories')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <i className="fas fa-list"></i>
                                        <span className="text-sm">List Categories</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/categories/create"
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                                            isActive('/categories/create')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <i className="fas fa-plus-circle"></i>
                                        <span className="text-sm">Add Category</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Orders Menu (Expandable) */}
                    <li>
                        <button
                            onClick={() => toggleMenu('orders')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition duration-200 ${
                                isMenuActive(['/orders'])
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <i className="fas fa-shopping-cart text-lg"></i>
                                <span className="font-medium">Orders</span>
                            </div>
                            <i className={`fas fa-chevron-right transform transition-transform ${openMenus.orders ? 'rotate-90' : ''}`}></i>
                        </button>
                        
                        {/* Orders Submenu */}
                        {openMenus.orders && (
                            <ul className="mt-1 ml-4 space-y-1">
                                <li>
                                    <Link
                                        to="/orders"
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                                            isActive('/orders')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <i className="fas fa-list"></i>
                                        <span className="text-sm">All Orders</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/orders/pending"
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                                            isActive('/orders/pending')
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <i className="fas fa-clock"></i>
                                        <span className="text-sm">Pending</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Users Section */}
                    <li className="pt-4 pb-2">
                        <span className="px-4 text-xs font-semibold text-gray-500 uppercase">
                            System
                        </span>
                    </li>

                    <li>
                        <Link
                            to="/users/list"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                                isActive('/users/list')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <i className="fas fa-users text-lg"></i>
                            <span className="font-medium">Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/roles/list"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                                isActive('/roles/list')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <i className="fas fa-user-shield text-lg"></i>
                            <span className="font-medium">Roles</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/settings"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                                isActive('/settings')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`}
                        >
                            <i className="fas fa-cog text-lg"></i>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-center">
                    © 2026 Bookstore Admin
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;