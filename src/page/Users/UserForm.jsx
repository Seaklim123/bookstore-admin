import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const UserCreateEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get user ID from URL if editing
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: []
    });

    // Fetch roles and user data (if editing)
    useEffect(() => {
        fetchRoles();
        if (isEditMode) {
            fetchUser();
        }
    }, [id]);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/roles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRoles(data.data || data);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.data || data;
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    password: '',
                    password_confirmation: '',
                    roles: user.roles?.map(role => role.id) || []
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = parseInt(e.target.value);
        setFormData(prev => ({
            ...prev,
            roles: [selectedRole]
        }));
        if (errors.roles) {
            setErrors(prev => ({ ...prev, roles: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!isEditMode && !formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        
        if (!isEditMode && !formData.password) {
            newErrors.password = 'Password is required';
        }
        
        if (!isEditMode && formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }
        
        if (formData.roles.length === 0) {
            newErrors.roles = 'Please select a role';
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
            const token = localStorage.getItem('token');
            const url = isEditMode 
                ? `http://localhost:8000/api/users/${id}`
                : 'http://localhost:8000/api/users';
            
            const method = isEditMode ? 'PUT' : 'POST';
            
            // Prepare data - don't send password fields if empty in edit mode
            const submitData = { ...formData };
            if (isEditMode && !submitData.password) {
                delete submitData.password;
                delete submitData.password_confirmation;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (response.ok) {
                // Success - redirect to user list
                navigate('/users/list');
            } else {
                // Handle validation errors from API
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data.message || 'An error occurred');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while saving the user');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Register Data Management
                    </h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                                <span className="text-red-600">*</span> NAME
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field - Only show in create mode or always */}
                        {!isEditMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                    <span className="text-red-600">*</span> EMAIL
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        )}

                        {/* Password Field */}
                        {!isEditMode && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                        <span className="text-red-600">*</span> PASSWORD
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password_confirmation">
                                        <span className="text-red-600">*</span> CONFIRM PASSWORD
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Confirm password"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="roles">
                                <span className="text-red-600">*</span> ROLES
                            </label>
                            <select
                                id="roles"
                                name="roles"
                                value={formData.roles[0] || ''}
                                onChange={handleRoleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.roles ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select a role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roles && (
                                <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer with buttons */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <Link
                            to="/users/list"
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing 
                                ? (isEditMode ? 'Updating...' : 'Saving...') 
                                : (isEditMode ? 'Update' : 'Save')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreateEdit;