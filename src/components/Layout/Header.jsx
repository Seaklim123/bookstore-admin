import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;