
export const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const [meta, data] = reader.result.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        resolve({ base64: data, mimeType });
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const urlToBase64 = async (url: string): Promise<{base64: string, mimeType: string}> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const data = reader.result.split(',')[1];
                resolve({ base64: data, mimeType });
            } else {
                reject('Could not convert blob to base64');
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
