
export enum AppState {
  SPLASH,
  SELECTION,
  LOADING,
  RESULT,
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
  mimeType: string | null;
}
