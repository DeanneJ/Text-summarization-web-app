// Summaries.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Summaries = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { userInfo } = useSelector(state => state.auth);
    const userId = userInfo ? userInfo._id : ''; 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const response = await axios.get(`/api/summaries/user/${userId}`);
                setSummaries(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching summaries');
                setLoading(false);
            }
        };

        fetchSummaries();
    }, [userId]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/summaries/${id}`);
            setSummaries(summaries.filter(summary => summary._id !== id));
        } catch (err) {
            setError('Error deleting summary');
        }
    };

    const filteredSummaries = summaries.filter(summary =>
        summary.heading.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl p-4 mx-auto">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by heading..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Summaries List */}
            <div className="flex flex-col gap-4">
                {filteredSummaries.map(summary => (
                    <div 
                        className="relative p-4 bg-white border border-gray-200 rounded-lg shadow-md"
                        key={summary._id}
                    >
                        <h3 className="mb-2 text-xl font-semibold text-left">{summary.heading}</h3>
                        <p className="mb-2 text-left text-gray-700">{summary.summary}</p>


                        <div className='m-10'>
                        <div className="absolute text-sm text-gray-400 bottom-4 right-4 mr-[100px]">
                            <p><strong>Original Word Count:</strong> {summary.originalWordCount}</p>
                            <p><strong>Summary Word Count:</strong> {summary.summaryWordCount}</p>
                        </div>

                        <button 
                            onClick={() => handleDelete(summary._id)} 
                            className="absolute px-4 py-2 text-white bg-red-500 rounded bottom-4 right-4 hover:bg-red-600"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Summaries;
