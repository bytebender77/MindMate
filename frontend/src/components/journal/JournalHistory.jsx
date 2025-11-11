import { Calendar, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import EmotionBadge from '../common/EmotionBadge';
import EmptyState from '../common/EmptyState';
import { useState } from 'react';
import Modal from '../common/Modal';

const JournalHistory = ({ entries = [], onDelete, onEdit }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No journal entries yet"
        description="Start your journey by writing your first journal entry above"
        actionText="Start Journaling"
        onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy • h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition border-l-4 border-primary-500 dark:border-primary-400"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400 dark:text-gray-500" size={18} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {formatDate(entry.created_at)}
                </span>
              </div>
              {entry.emotion && (
                <EmotionBadge 
                  emotion={entry.emotion} 
                  emotionMetadata={entry.emotion_metadata}
                  size="sm" 
                />
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
              {entry.content}
            </p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedEntry(entry)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1 transition"
              >
                Read More <ChevronRight size={16} />
              </button>
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(entry)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title="Journal Entry"
        size="lg"
      >
        {selectedEntry && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400 dark:text-gray-500" size={18} />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {formatDate(selectedEntry.created_at)}
                </span>
              </div>
              {selectedEntry.emotion && (
                <EmotionBadge 
                  emotion={selectedEntry.emotion} 
                  emotionMetadata={selectedEntry.emotion_metadata}
                  showBreakdown={true}
                />
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {selectedEntry.content}
            </p>
            {selectedEntry.reflection && (
              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/30">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">AI Reflection</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedEntry.reflection}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default JournalHistory;
