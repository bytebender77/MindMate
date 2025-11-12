import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, PieChart, Activity } from 'lucide-react';
import Card from '../components/common/Card';
import MoodChart from '../components/mood/MoodChart';
import MoodCalendar from '../components/mood/MoodCalendar';
import EmotionDistribution from '../components/mood/EmotionDistribution';
import { useMood } from '../hooks/useMood';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const InsightsPage = () => {
  const [timeRange, setTimeRange] = useState(7);
  const { stats, loading, error, refreshStats } = useMood(timeRange);

  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
    refreshStats(days);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
              Your Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Visualize your emotional journey and discover patterns
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Error Loading Insights</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => refreshStats(timeRange)}
              className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no stats or no data
  if (!stats || (stats.totalEntries === 0 && (!stats.emotionStats || stats.emotionStats.length === 0))) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
              Your Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Visualize your emotional journey and discover patterns
            </p>
          </div>
          <EmptyState
            icon={TrendingUp}
            title="No insights yet"
            description="Start journaling to see your emotional patterns and insights"
            actionText="Start Journaling"
            onAction={() => window.location.href = '/dashboard'}
          />
        </div>
      </div>
    );
  }

  // Safe access to stats with defaults - only accessed after we know stats exists and has data
  const emotionStats = Array.isArray(stats.emotionStats) ? stats.emotionStats : [];
  const entries = Array.isArray(stats.entries) ? stats.entries : (Array.isArray(stats.weeklyTrend) ? stats.weeklyTrend : []);
  const positiveRatio = typeof stats.positiveRatio === 'number' ? stats.positiveRatio : 0;
  const totalEntries = typeof stats.totalEntries === 'number' ? stats.totalEntries : 0;
  const mostCommonEmotion = stats.mostCommonEmotion || 'N/A';
  const streak = typeof stats.streak === 'number' ? stats.streak : 0;

  const timeRanges = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: 'All Time', value: 365 }
  ];

  const overviewStats = [
    {
      icon: Activity,
      label: 'Total Entries',
      value: totalEntries,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Most Common',
      value: mostCommonEmotion,
      color: 'from-green-500 to-green-600',
      capitalize: true
    },
    {
      icon: PieChart,
      label: 'Positive Ratio',
      value: `${positiveRatio}%`,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      label: 'Current Streak',
      value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
      color: 'from-orange-500 to-red-600'
    }
  ];

  // Prepare chart data safely
  const doughnutData = {
    labels: emotionStats
      .map(s => {
        if (!s || typeof s !== 'object') return null;
        return s.emotion || s.label || null;
      })
      .filter(Boolean),
    values: emotionStats
      .map(s => {
        if (!s || typeof s !== 'object') return 0;
        const val = s.count || s.value || 0;
        return typeof val === 'number' && val > 0 ? val : 0;
      })
      .filter(v => v > 0)
  };

  // Render main content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
            Your Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Visualize your emotional journey and discover patterns
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Time Range</h2>
            <div className="flex gap-2">
              {timeRanges.map(range => (
                <button
                  key={range.value}
                  onClick={() => handleTimeRangeChange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    timeRange === range.value
                      ? 'bg-primary-600 dark:bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 ${stat.capitalize ? 'capitalize' : ''}`}>
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Emotion Distribution</h3>
            {emotionStats.length > 0 && doughnutData.labels.length > 0 && doughnutData.values.length > 0 ? (
              <MoodChart data={doughnutData} type="doughnut" />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
            )}
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Detailed Breakdown</h3>
            {emotionStats.length > 0 ? (
              <EmotionDistribution stats={emotionStats} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
            )}
          </Card>
        </div>

        <Card>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Mood Calendar</h3>
          {entries && entries.length > 0 ? (
            <MoodCalendar entries={entries} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No calendar data available</p>
          )}
        </Card>

        <div className="mt-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-8 border border-primary-100 dark:border-primary-800/30 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your Progress</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {positiveRatio >= 60 ? (
                  <>You're maintaining a healthy emotional balance! Your positive emotions are {positiveRatio}% of your entries. Keep up the great work with your journaling practice.</>
                ) : positiveRatio >= 40 ? (
                  <>You're making progress on your emotional wellness journey. Consider exploring activities that bring you joy to help shift your emotional balance.</>
                ) : (
                  <>This is a challenging time, but you're taking the right steps by journaling. Consider reaching out to a mental health professional for additional support.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
