
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, Trash2, Shield, User, Mail, UserCheck, X } from 'lucide-react';

const AdminUserListScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.isAdmin) {
            fetchUsers();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (searchTerm) {
            setFilteredUsers(users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredUsers(users);
        }
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const { data } = await axios.get('/users');
            console.log('Users fetched:', data);
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users', error);
            console.error('Error response:', error.response);
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user', error);
            }
        }
    };

    const toggleAdminStatus = async (userToUpdate) => {
        if (window.confirm(`Are you sure you want to ${userToUpdate.isAdmin ? 'remove admin rights from' : 'promote to admin'} ${userToUpdate.name}?`)) {
            try {
                await axios.put(`/users/${userToUpdate._id}`, {
                    ...userToUpdate,
                    isAdmin: !userToUpdate.isAdmin
                });
                fetchUsers();
            } catch (error) {
                console.error('Error updating user', error);
            }
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading Users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <UserCheck className="text-emerald-600" size={32} /> User Management
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage {users.length} registered customers and admins</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User ID</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 font-bold">
                                        #{u._id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                {u.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="font-bold text-gray-900">{u.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Mail size={14} className="text-gray-400" />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.isAdmin ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                                <Shield size={12} /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                <User size={12} /> Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {u._id !== user._id && (
                                                <>
                                                    <button
                                                        onClick={() => toggleAdminStatus(u)}
                                                        className={`p-2 rounded-lg transition-colors ${u.isAdmin ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-purple-600 hover:bg-purple-50'}`}
                                                        title={u.isAdmin ? "Remove Admin" : "Make Admin"}
                                                    >
                                                        <Shield size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteHandler(u._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 font-medium">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserListScreen;
