import { useCallback, useState } from 'react';

export type FileReaderMethod = 'readAsText' | 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsBinaryString';

export interface UseFileReaderOptions {
  method?: FileReaderMethod;
  onLoad?: (result: string | ArrayBuffer | null) => void;
  onError?: (error: ProgressEvent<FileReader>) => void;
}

export interface UseFileReaderReturn {
  result: string | ArrayBuffer | null;
  error: ProgressEvent<FileReader> | null;
  loading: boolean;
  read: (file: File | Blob) => void;
  reset: () => void;
}

const useFileReader = (options: UseFileReaderOptions = {}): UseFileReaderReturn => {
  const { method = 'readAsText', onLoad, onError } = options;
  const [result, setResult] = useState<string | ArrayBuffer | null>(null);
  const [error, setError] = useState<ProgressEvent<FileReader> | null>(null);
  const [loading, setLoading] = useState(false);

  const read = useCallback(
    (file: File | Blob) => {
      setLoading(true);
      setError(null);
      setResult(null);

      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result ?? null;
        setResult(result);
        setLoading(false);
        onLoad?.(result);
      };

      reader.onerror = (event) => {
        setError(event);
        setLoading(false);
        onError?.(event);
      };

      switch (method) {
        case 'readAsText':
          reader.readAsText(file);
          break;
        case 'readAsDataURL':
          reader.readAsDataURL(file);
          break;
        case 'readAsArrayBuffer':
          reader.readAsArrayBuffer(file);
          break;
        case 'readAsBinaryString':
          reader.readAsBinaryString(file);
          break;
      }
    },
    [method, onLoad, onError],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, error, loading, read, reset };
};

export default useFileReader;

