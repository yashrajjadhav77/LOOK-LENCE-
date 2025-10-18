import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from './types';
import type { ImageState } from './types';
import { UploadIcon, UndoIcon, DownloadIcon } from './constants';
import { fileToBase64 } from './utils/fileUtils';
import { generateVirtualTryOnImage } from './services/geminiService';

// --- Helper Components ---

const SplashScreen: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fadeInTimer = setTimeout(() => setVisible(true), 100);
        const fadeOutTimer = setTimeout(() => setVisible(false), 2200);
        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(fadeOutTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center transition-opacity duration-500" style={{ opacity: visible ? 1 : 0 }}>
            <h1 className="text-6xl md:text-8xl font-display tracking-wider text-white">
                LOOK LENCE
            </h1>
            <p className="mt-4 text-gray-500 text-sm tracking-widest">
                MADE BY YASHRAJ VIJAYKUMAR JADHAV
            </p>
        </div>
    );
};

const LoadingScreen: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
        <p className="text-white text-xl mt-4 tracking-wider">Styling your new look...</p>
        <p className="text-gray-400 text-sm mt-2">This may take a moment.</p>
    </div>
);

interface ImageUploaderProps {
    title: string;
    onImageChange: (imageState: ImageState) => void;
    imagePreviewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageChange, imagePreviewUrl }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            const { base64, mimeType } = await fileToBase64(file);
            onImageChange({ file, previewUrl, base64, mimeType });
        }
    };

    const handleClick = () => inputRef.current?.click();

    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">{title}</h3>
            <div
                onClick={handleClick}
                className="cursor-pointer aspect-[3/4] border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center bg-gray-700 hover:border-purple-400 hover:bg-gray-600 transition-all duration-300"
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <div className="text-center">
                        <UploadIcon />
                        <p className="mt-2 text-sm text-gray-400">Click to upload</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ResultViewProps {
    userImage: ImageState;
    generatedImage: string;
    onUndo: () => void;
}
const ResultView: React.FC<ResultViewProps> = ({ userImage, generatedImage, onUndo }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const afterImageUrl = `data:image/png;base64,${generatedImage}`;

    const handleMove = (clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percentage);
        }
    };
    
    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        handleMove(event.touches[0].clientX);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.buttons === 1) { // Left mouse button is down
            handleMove(event.clientX);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = afterImageUrl;
        link.download = 'look-lence-creation.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
             <div 
                ref={containerRef}
                className="relative w-full aspect-[3/4] max-w-lg cursor-ew-resize select-none overflow-hidden rounded-lg shadow-2xl"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                <img src={userImage.previewUrl!} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}>
                    <img src={afterImageUrl} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 bottom-0 bg-white w-1" style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white h-10 w-10 rounded-full border-2 border-purple-500 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                    onClick={onUndo}
                    className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    <UndoIcon/>
                    Try Another
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                    <DownloadIcon />
                    Download
                </button>
            </div>
        </div>
    );
};

// --- Main App Component ---

export default function App() {
    const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
    const [userImage, setUserImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null, mimeType: null });
    const [outfitImage, setOutfitImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null, mimeType: null });
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setAppState(AppState.SELECTION), 2800);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerateClick = useCallback(async () => {
        if (!userImage.base64 || !outfitImage.base64 || !userImage.mimeType || !outfitImage.mimeType) {
            setError("Please select both your photo and an outfit.");
            return;
        }
        setError(null);
        setAppState(AppState.LOADING);
        try {
            const result = await generateVirtualTryOnImage(userImage.base64, userImage.mimeType, outfitImage.base64, outfitImage.mimeType);
            setGeneratedImage(result);
            setAppState(AppState.RESULT);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
            setAppState(AppState.SELECTION);
        }
    }, [userImage, outfitImage]);
    
    const handleUndo = () => {
        setUserImage({ file: null, previewUrl: null, base64: null, mimeType: null });
        setOutfitImage({ file: null, previewUrl: null, base64: null, mimeType: null });
        setGeneratedImage(null);
        setError(null);
        setAppState(AppState.SELECTION);
    };

    const renderContent = () => {
        switch (appState) {
            case AppState.SPLASH:
                return <SplashScreen />;
            case AppState.LOADING:
                // Show selection screen in the background
                return (
                    <>
                        {renderSelectionScreen()}
                        <LoadingScreen />
                    </>
                );
            case AppState.RESULT:
                if (userImage && generatedImage) {
                    return <ResultView userImage={userImage} generatedImage={generatedImage} onUndo={handleUndo} />;
                }
                return renderSelectionScreen(); // Fallback
            case AppState.SELECTION:
            default:
                return renderSelectionScreen();
        }
    };

    const renderSelectionScreen = () => (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-display">LOOK LENCE</h1>
                <p className="text-gray-400">see future with yashraj empire</p>
            </div>
            {error && <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUploader title="1. Your Photo" onImageChange={setUserImage} imagePreviewUrl={userImage.previewUrl} />
                <div>
                    <ImageUploader title="2. The Outfit" onImageChange={setOutfitImage} imagePreviewUrl={outfitImage.previewUrl} />
                </div>
            </div>
            <div className="text-center mt-8">
                <button
                    onClick={handleGenerateClick}
                    disabled={!userImage.previewUrl || !outfitImage.previewUrl}
                    className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    Generate Look
                </button>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4">
            {renderContent()}
        </main>
    );
}