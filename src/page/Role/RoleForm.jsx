import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const RoleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        permissions: []
    });

    // Fetch permissions and role data (if editing)
    useEffect(() => {
        fetchPermissions();
        if (isEditMode) {
            fetchRole();
        }
    }, [id]);

    const fetchPermissions = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            console.log('Token:', token); // Add this
            const response = await fetch('http://localhost:8000/api/admin/permissions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status); // Add this

            if (response.ok) {
                const data = await response.json();
                setPermissions(data.data || data);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const fetchRole = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost:8000/api/admin/roles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const role = data.data || data;
                setFormData({
                    name: role.name || '',
                    permissions: role.permissions?.map(p => p.id) || []
                });
            }
        } catch (error) {
            console.error('Error fetching role:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => {
            const currentPermissions = prev.permissions;
            const newPermissions = currentPermissions.includes(permissionId)
                ? currentPermissions.filter(id => id !== permissionId)
                : [...currentPermissions, permissionId];
            
            return {
                ...prev,
                permissions: newPermissions
            };
        });
        if (errors.permissions) {
            setErrors(prev => ({ ...prev, permissions: '' }));
        }
    };

    const handleSelectAll = () => {
        const allPermissionIds = permissions.map(p => p.id);
        setFormData(prev => ({
            ...prev,
            permissions: allPermissionIds
        }));
    };

    const handleDeselectAll = () => {
        setFormData(prev => ({
            ...prev,
            permissions: []
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Role name is required';
        }
        
        if (formData.permissions.length === 0) {
            newErrors.permissions = 'Please select at least one permission';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    setProcessing(true);
    setErrors({});

    try {
        const token = localStorage.getItem('admin_token');
        const url = isEditMode 
            ? `http://localhost:8000/api/admin/roles/${id}`
            : 'http://localhost:8000/api/admin/roles';
        
        const method = isEditMode ? 'PUT' : 'POST';

        console.debug('Submitting role payload', { url, method, payload: formData });

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            navigate('/roles/list');
        } else {
            console.error('Role save failed', response.status, data);

            if (response.status === 422) {
                const normalized = {};
                if (data.errors && typeof data.errors === 'object') {
                    Object.entries(data.errors).forEach(([key, val]) => {
                        normalized[key] = Array.isArray(val) ? val[0] : val;
                    });
                } else if (Array.isArray(data.errors)) {
                    normalized.general = data.errors.join(' ');
                } else if (data.message) {
                    normalized.general = data.message;
                } else {
                    normalized.general = 'Validation failed';
                }
                setErrors(normalized);
            } else {
                alert(data.message || 'An error occurred');
            }
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while saving the role');
    } finally {
        setProcessing(false);
    }
};

    // Group permissions by category (assuming permission names like "user-create", "user-edit")
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const category = permission.name.split('-')[0] || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Role' : 'Create New Role'}
                        </h1>
                        
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md">

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Role Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                                <span className="text-red-600">*</span> ROLE NAME
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="e.g., Administrator, Editor, Viewer"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Permissions Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="text-red-600">*</span> PERMISSIONS
                                </label>
                            </div>

                            {/* Permission Groups */}
                            <div className={`border rounded-lg p-4 space-y-4 ${
                                errors.permissions ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                                {Object.keys(groupedPermissions).length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No permissions available</p>
                                ) : (
                                    Object.entries(groupedPermissions).map(([category, perms]) => (
                                        <div key={category} className="bg-white rounded-lg p-4 shadow-sm">
                                            <h4 className="font-semibold text-gray-800 mb-3 capitalize flex items-center gap-2">
                                                <i className="fas fa-folder text-blue-600"></i>
                                                {category}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {perms.map((permission) => (
                                                    <label
                                                        key={permission.id}
                                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.permissions.includes(permission.id)}
                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700 flex-1">
                                                            {permission.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {errors.permissions && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <i className="fas fa-exclamation-circle"></i>
                                    {errors.permissions}
                                </p>
                            )}

                            {/* Selected Count */}
                            <div className="mt-3 text-sm text-gray-600">
                                <i className="fas fa-check-circle text-green-600 mr-1"></i>
                                {formData.permissions.length} permission(s) selected
                            </div>
                        </div>
                    </div>

                    {/* Footer with buttons */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <Link
                            to="/roles"
                            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    {isEditMode ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'}`}></i>
                                    {isEditMode ? 'Update Role' : 'Create Role'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            
        </div>
    );
};

export default RoleForm;