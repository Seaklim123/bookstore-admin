import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await bookService.getAll();
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await bookService.delete(id);
                setBooks(books.filter(book => book.id !== id));
            } catch (error) {
                alert('Error deleting book');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Books Management</h2>
                <Link
                    to="/books/create"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    + Add New Book
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">Author</th>
                            <th className="text-left py-3 px-4">ISBN</th>
                            <th className="text-left py-3 px-4">Category</th>
                            <th className="text-left py-3 px-4">Price</th>
                            <th className="text-left py-3 px-4">Stock</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-center py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id} className="border-t hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{book.title}</td>
                                <td className="py-3 px-4">{book.author}</td>
                                <td className="py-3 px-4">{book.isbn}</td>
                                <td className="py-3 px-4">{book.category?.name}</td>
                                <td className="py-3 px-4">${book.price}</td>
                                <td className="py-3 px-4">{book.stock}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                        book.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {book.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex justify-center space-x-2">
                                        <Link
                                            to={`/books/edit/${book.id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookList;