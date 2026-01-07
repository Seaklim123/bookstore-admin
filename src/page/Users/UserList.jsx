import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserIndex = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({});
    const [deleteData, setDeleteData] = useState({ id: '', name: '' });
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users from API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8000/api/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.data || []); // Extract the data array
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDataDeletion = (data) => {
        setDataEdit(data);
        setDeleteData({ id: data.id, name: data.name });
        setConfirmingDataDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDataDeletion(false);
        setDataEdit({});
        setDeleteData({ id: '', name: '' });
    };

    const handleDelete = async (id) => {
        setProcessing(true);
        
        try {
            const token = localStorage.getItem('admin_token');
            
            const response = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Remove from local state
            setUsers(users.filter(user => user.id !== id));
            closeModal();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user');
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.roles && user.roles.length > 0 && user.roles[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div>
            {/* Header with Search */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                
                {/* Search Input */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    
                    <Link
                        to="/users/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        + Add New User
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4">#ID</th>
                            <th className="text-left py-3 px-4">Name</th>
                            <th className="text-left py-3 px-4">Email</th>
                            <th className="text-left py-3 px-4">Role</th>
                            <th className="text-left py-3 px-4">Created At</th>
                            <th className="text-center py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{user.id}</td>
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            user.roles && user.roles.length > 0 && user.roles[0]?.name === 'Admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.roles && user.roles.length > 0 ? user.roles[0]?.name : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                to={`/users/edit/${user.id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => confirmDataDeletion(user)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                    {searchTerm ? 'No users found matching your search' : 'There are no records!'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmingDataDeletion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">
                            Confirmation!
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 mb-6">
                            Are you sure you want to delete{' '}
                            <span className="text-lg font-medium">{deleteData.name}</span>?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={processing}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(dataEdit.id)}
                                disabled={processing}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                            >
                                {processing ? 'Deleting...' : 'Yes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserIndex;