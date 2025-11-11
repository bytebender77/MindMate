import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import Button from '../common/Button';
import { analysisAPI } from '../../services/api';
import toast from 'react-hot-toast';

const VoiceRecorder = ({ onTranscript, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        // Create blob and send to backend
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      toast.loading('Processing audio...');
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      // Convert blob to File
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

      // Send to backend for transcription
      const result = await analysisAPI.speechToText(audioFile);

      if (result.success && result.text) {
        toast.success('Audio transcribed successfully');
        if (onTranscript) {
          onTranscript(result.text);
        }
        if (onComplete) {
          onComplete(result.text);
        }
      } else {
        toast.error(result.error || 'Failed to transcribe audio');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isRecording ? 'danger' : 'secondary'}
        onClick={handleToggleRecording}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin" size={18} />
            Processing...
          </>
        ) : isRecording ? (
          <>
            <MicOff size={18} />
            Stop Recording
          </>
        ) : (
          <>
            <Mic size={18} />
            Start Recording
          </>
        )}
      </Button>
    </div>
  );
};

export default VoiceRecorder;
