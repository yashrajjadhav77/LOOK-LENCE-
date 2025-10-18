import React from 'react';

export const OUTFIT_CATALOG = [
  { id: '1', src: 'https://picsum.photos/id/1060/500/750', alt: 'Denim jacket and black jeans' },
  { id: '2', src: 'https://picsum.photos/id/219/500/750', alt: 'Elegant black dress' },
  { id: '3', src: 'https://picsum.photos/id/599/500/750', alt: 'Cozy winter sweater' },
  { id: '4', src: 'https://picsum.photos/id/579/500/750', alt: 'Summer floral dress' },
  { id: '5', src: 'https://picsum.photos/id/837/500/750', alt: 'Formal business suit' },
  { id: '6', src: 'https://picsum.photos/id/102/500/750', alt: 'Casual t-shirt and shorts' },
];

export const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />
    </svg>
);

export const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);