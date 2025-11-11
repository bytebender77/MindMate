import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import JournalHistory from '../components/journal/JournalHistory';
import { useJournal } from '../hooks/useJournal';
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HistoryPage = () => {
  const { entries, loading, deleteEntry } = useJournal();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const result = await deleteEntry(id);
      if (result.success) {
        toast.success('Entry deleted successfully');
      } else {
        toast.error('Failed to delete entry');
      }
    }
  };

  const filterEntries = () => {
    let filtered = [...entries];

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEmotion !== 'all') {
      filtered = filtered.filter(entry =>
        entry.emotion?.toLowerCase() === selectedEmotion.toLowerCase()
      );
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      const timeRanges = {
        today: 1,
        week: 7,
        month: 30
      };

      if (timeRanges[timeFilter]) {
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - timeRanges[timeFilter]);
        filtered = filtered.filter(entry =>
          new Date(entry.created_at) >= cutoff
        );
      }
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    return filtered;
  };

  const filteredEntries = filterEntries();
  const hasActiveFilters = searchTerm || selectedEmotion !== 'all' || timeFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEmotion('all');
    setTimeFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
            Journal History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Browse and search through your past entries
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emotion
                </label>
                <select
                  value={selectedEmotion}
                  onChange={(e) => setSelectedEmotion(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Emotions</option>
                  <option value="joy">Joy</option>
                  <option value="sadness">Sadness</option>
                  <option value="anger">Anger</option>
                  <option value="fear">Fear</option>
                  <option value="surprise">Surprise</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition"
              >
                <X size={16} />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredEntries.length} of {entries.length} entries
            </div>
            <JournalHistory
              entries={filteredEntries}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
