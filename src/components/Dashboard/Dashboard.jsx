import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await dashboardService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Books', value: stats?.total_books || 0, icon: '📚', color: 'bg-blue-500' },
        { title: 'Categories', value: stats?.total_categories || 0, icon: '📁', color: 'bg-green-500' },
        { title: 'Total Orders', value: stats?.total_orders || 0, icon: '🛒', color: 'bg-purple-500' },
        { title: 'Customers', value: stats?.total_customers || 0, icon: '👥', color: 'bg-yellow-500' },
        { title: 'Total Revenue', value: `$${stats?.total_revenue || 0}`, icon: '💰', color: 'bg-pink-500' },
        { title: 'Pending Orders', value: stats?.pending_orders || 0, icon: '⏳', color: 'bg-orange-500' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">{card.title}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                            </div>
                            <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {stats?.recent_orders && stats.recent_orders.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Order #</th>
                                    <th className="text-left py-3 px-4">Customer</th>
                                    <th className="text-left py-3 px-4">Amount</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent_orders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{order.order_number}</td>
                                        <td className="py-3 px-4">{order.user?.name}</td>
                                        <td className="py-3 px-4">${order.total_amount}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;