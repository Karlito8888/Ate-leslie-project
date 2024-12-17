declare module 'pdfjs-dist/build/pdf.worker.entry' {
  const workerSrc: string;
  export default workerSrc;
}

declare module 'react-pdf' {
  import { ComponentType, ReactElement } from 'react';

  interface LoadSuccess {
    numPages: number;
  }

  interface DocumentProps {
    file: string | { url: string; data: any };
    onLoadSuccess?: (pdf: LoadSuccess) => void;
    onLoadError?: (error: Error) => void;
    loading?: ReactElement;
    noData?: ReactElement;
    error?: ReactElement;
    children?: ReactElement | ReactElement[];
  }

  interface PageProps {
    pageNumber: number;
    width?: number;
    height?: number;
    scale?: number;
    rotate?: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    loading?: ReactElement;
    error?: ReactElement;
    noData?: ReactElement;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  
  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  };
} 