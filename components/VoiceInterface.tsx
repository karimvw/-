
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
import { XIcon, MicIcon, LogoIcon } from './Icons';

interface VoiceInterfaceProps {
  onClose: () => void;
  systemInstruction: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onClose, systemInstruction }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('جاري الاتصال بالمحامي...');
  
  const audioContextRef = useRef<{
    input: AudioContext;
    output: AudioContext;
  } | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputAudioContext, output: outputAudioContext };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('المحامي يستمع إليك الآن...');
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
              
              // Simple volume detection for UI
              const volume = inputData.reduce((a, b) => a + Math.abs(b), 0) / inputData.length;
              setIsListening(volume > 0.01);
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextRef.current?.output;
              if (ctx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
                setStatus('المحامي يتحدث...');
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('المحامي ينصت لمقاطعتك...');
            }

            if (message.serverContent?.turnComplete) {
              setStatus('المحامي ينتظر سؤالك التالي...');
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setStatus('حدث خطأ في الاتصال.');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('انتهت الجلسة.');
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('فشل الوصول للميكروفون أو الاتصال.');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    sourcesRef.current.forEach(s => s.stop());
    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
        <button 
          onClick={stopSession}
          className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon />
        </button>

        <div className="mt-8 mb-12 relative">
          {/* Animated Background Rings */}
          <div className={`absolute inset-0 rounded-full bg-blue-500/10 animate-ping ${isListening ? 'scale-150' : 'scale-100'}`} />
          <div className="relative w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-blue-600/30">
            <LogoIcon />
          </div>
          
          {/* Waveform Visualization Placeholder */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 h-8 items-end">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 bg-blue-500 rounded-full transition-all duration-150 ${isListening ? 'animate-bounce' : 'h-2'}`}
                style={{ animationDelay: `${i * 0.1}s`, height: isListening ? `${Math.random() * 100}%` : '8px' }}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">المحامي الجزائري - مباشر</h2>
        <p className={`text-lg transition-colors duration-300 ${isListening ? 'text-blue-400' : 'text-slate-400'}`}>
          {status}
        </p>

        <div className="mt-12 w-full flex flex-col gap-4">
           <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
             <MicIcon className="w-5 h-5 text-blue-400" />
             <p className="text-sm text-slate-300">تحدث بوضوح عن مشكلتك القانونية. يمكنك مقاطعة المحامي في أي وقت.</p>
           </div>
           <button 
             onClick={stopSession}
             className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold rounded-2xl transition-all border border-red-900/50"
           >
             إنهاء المكالمة
           </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
