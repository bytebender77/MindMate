import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

const MoodCalendar = ({ entries = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const emotionColors = {
    joy: 'bg-green-200 text-green-800',
    sadness: 'bg-blue-200 text-blue-800',
    anger: 'bg-red-200 text-red-800',
    fear: 'bg-purple-200 text-purple-800',
    surprise: 'bg-yellow-200 text-yellow-800',
    neutral: 'bg-gray-200 text-gray-800'
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntryForDay = (day) => {
    try {
      const dayStr = format(day, 'yyyy-MM-dd');
      return entries.find(entry => {
        if (!entry) return false;
        // Handle both created_at (from journal entries) and date (from weekly_trend)
        const entryDateStr = entry.created_at || entry.date;
        if (!entryDateStr) return false;
        try {
          const entryDate = format(new Date(entryDateStr), 'yyyy-MM-dd');
          return entryDate === dayStr;
        } catch (err) {
          console.error('Error formatting entry date:', err);
          return false;
        }
      });
    } catch (err) {
      console.error('Error getting entry for day:', err);
      return null;
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}

        {monthDays.map((day, index) => {
          try {
            const entry = getEntryForDay(day);
            const dayColor = entry && entry.emotion ? emotionColors[entry.emotion.toLowerCase()] || emotionColors.neutral : '';
            const today = isToday(day);
            // Handle entries that might not have content (weekly_trend entries)
            const entryTitle = entry && entry.emotion 
              ? entry.content 
                ? `${entry.emotion}: ${entry.content.substring(0, 50)}${entry.content.length > 50 ? '...' : ''}`
                : `${entry.emotion}`
              : '';

            return (
              <div
                key={index}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm
                  ${dayColor}
                  ${!entry && 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-700/50'}
                  ${today && 'ring-2 ring-primary-500 dark:ring-primary-400'}
                  ${entry && 'cursor-pointer hover:opacity-80'}
                  transition
                `}
                title={entryTitle}
              >
                {format(day, 'd')}
              </div>
            );
          } catch (err) {
            console.error('Error rendering calendar day:', err);
            return (
              <div
                key={index}
                className="aspect-square flex items-center justify-center rounded-lg text-sm text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-700/50"
              >
                {format(day, 'd')}
              </div>
            );
          }
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {Object.entries(emotionColors).map(([emotion, color]) => (
          <div key={emotion} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`}></div>
            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodCalendar;
