import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService, categoryService } from '../../services/api';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        author: '',
        isbn: '',
        description: '',
        price: '',
        stock: '',
        pages: '',
        publisher: '',
        published_date: '',
        language: 'English',
        is_active: true,
    });

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchBook();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBook = async () => {
        try {
            const response = await bookService.getOne(id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching book:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await bookService.update(id, formData);
            } else {
                await bookService.create(formData);
            }
            navigate('/books');
        } catch (error) {
            alert('Error saving book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {id ? 'Edit Book' : 'Add New Book'}
            </h2>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ISBN *</label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                            <input
                                type="number"
                                name="pages"
                                value={formData.pages}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
                            <input
                                type="text"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                            <input
                                type="date"
                                name="published_date"
                                value={formData.published_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label className="ml-2 text-sm text-gray-700">Active</label>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? 'Saving...' : 'Save Book'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/books')}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;