import { useState } from 'react';
import { PenTool, Send } from 'lucide-react';
import Button from '../common/Button';
import VoiceRecorder from './VoiceRecorder';

const JournalInput = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const maxLength = 5000;

  const handleSubmit = () => {
    if (content.trim() && !isLoading) {
      onSubmit(content, false);
      setContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setContent(transcript);
    setShowVoiceRecorder(false);
  };

  const handleVoiceComplete = (transcript) => {
    // Auto-submit after voice transcription
    if (transcript.trim()) {
      onSubmit(transcript, true);
      setContent('');
      setShowVoiceRecorder(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-2 border-transparent dark:border-gray-700 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
          <PenTool className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">How are you feeling today?</h2>
      </div>

      {showVoiceRecorder ? (
        <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-2 border-primary-200 dark:border-primary-800/30">
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            onComplete={handleVoiceComplete}
          />
          <button
            onClick={() => setShowVoiceRecorder(false)}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Or type instead
          </button>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-48 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition bg-white dark:bg-gray-700"
          placeholder="Write your thoughts here... This is your safe space"
          maxLength={maxLength}
        />
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {content.length} / {maxLength}
        </span>
        <div className="flex gap-3">
          {!showVoiceRecorder && (
            <Button
              variant="secondary"
              onClick={() => setShowVoiceRecorder(true)}
              disabled={isLoading}
            >
              Use Voice
            </Button>
          )}
          {!showVoiceRecorder && (
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              disabled={!content.trim() || isLoading}
            >
              <Send size={18} />
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalInput;
