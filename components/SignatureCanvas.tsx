import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool, CheckCircle, Upload } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (signatureDataUrl: string) => void;
  isLocked: boolean;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSave, isLocked }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
      }
    }
    
    // Resize handler
    const handleResize = () => {
       if (canvas && !hasSignature && !isLocked) {
         canvas.width = canvas.parentElement?.clientWidth || 500;
         canvas.height = 200;
       }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasSignature, isLocked]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    if (!hasSignature) setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
        setIsDrawing(false);
        if (hasSignature) {
            const canvas = canvasRef.current;
            if (canvas) {
                onSave(canvas.toDataURL());
            }
        }
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearSignature = () => {
    if (isLocked) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        onSave('');
      }
    }
  };

  const handleImageImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked || !e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) return;
      
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear existing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit within canvas while maintaining aspect ratio
        const scale = Math.min(
          (canvas.width - 40) / img.width, 
          (canvas.height - 40) / img.height
        );
        
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        ctx.drawImage(img, x, y, w, h);
        setHasSignature(true);
        onSave(canvas.toDataURL());
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset value so same file can be selected again if needed
    e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-colors ${hasSignature ? 'border-brand-500 bg-brand-50/30' : 'border-slate-300 bg-white'}`}>
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {!hasSignature && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400">
            <span className="flex items-center gap-2 text-sm font-medium">
              <PenTool size={16} /> Assine ou Importe uma Imagem
            </span>
          </div>
        )}

        {isLocked && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-brand-200 flex items-center gap-2 text-brand-700 font-bold">
                    <CheckCircle size={20} /> Assinado Digitalmente
                </div>
            </div>
        )}
      </div>
      
      {!isLocked && (
        <div className="flex justify-end mt-2 gap-2">
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageImport} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            onClick={triggerFileInput}
            className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-700 transition-colors px-3 py-1 rounded hover:bg-brand-50"
          >
            <Upload size={14} /> Importar Assinatura
          </button>
          
          <button
            onClick={clearSignature}
            className="text-xs flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors px-3 py-1 rounded hover:bg-slate-100"
            disabled={!hasSignature}
          >
            <Eraser size={14} /> Limpar
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureCanvas;