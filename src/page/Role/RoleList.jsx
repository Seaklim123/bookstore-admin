import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({});
    const [deleteData, setDeleteData] = useState({ id: '', name: '' });
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch roles from API
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token'); // ✅ Changed

            const response = await fetch(`http://localhost:8000/api/admin/roles`, { // ✅ Added /admin
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch roles');
            }

            const data = await response.json();
            setRoles(data.data || data || []); // Handle different response formats
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching roles:', err);
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
            const token = localStorage.getItem('admin_token'); // ✅ Changed

            const response = await fetch(`http://localhost:8000/api/admin/roles/${id}`, { // ✅ Added /admin
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete role');
            }

            // Remove from local state
            setRoles(roles.filter(role => role.id !== id));
            closeModal();
        } catch (err) {
            console.error('Error deleting role:', err);
            alert('Failed to delete role');
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

    // Filter roles based on search term
    const filteredRoles = roles.filter(role => 
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                    <button 
                        onClick={fetchRoles}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header with Search */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Role Management</h2>

                {/* Search Input */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>

                    <Link
                        to="/roles/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i>
                        Add New Role
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
                            <th className="text-left py-3 px-4">Permissions</th>
                            <th className="text-left py-3 px-4">Created At</th>
                            <th className="text-center py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoles.length > 0 ? (
                            filteredRoles.map((role) => (
                                <tr key={role.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{role.id}</td>
                                    <td className="py-3 px-4 font-semibold">{role.name}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {role.permissions?.length || 0} permissions
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{formatDate(role.created_at)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                to={`/roles/edit/${role.id}`}
                                                className="text-blue-600 hover:text-blue-800 px-3 py-1"
                                            >
                                                <i className="fas fa-edit mr-1"></i>
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => confirmDataDeletion(role)}
                                                className="text-red-600 hover:text-red-800 px-3 py-1"
                                            >
                                                <i className="fas fa-trash mr-1"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    {searchTerm ? 'No roles found matching your search' : 'There are no records!'}
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

export default RoleList;