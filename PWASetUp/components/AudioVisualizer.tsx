import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      animate();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / dataArray.length;
    let x = 0;

    dataArray.forEach((value) => {
      const barHeight = (value / 255) * canvas.height;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(1, '#818cf8');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      
      x += barWidth;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <canvas 
      ref={canvasRef}
      width={400}
      height={100}
      className="w-full rounded-lg bg-zinc-900/10 dark:bg-zinc-100/10"
    />
  );
};

export default AudioVisualizer;