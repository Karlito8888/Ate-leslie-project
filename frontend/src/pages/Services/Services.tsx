import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './Services.module.scss';

interface CatalogInfo {
  id: number;
  title: string;
  path: string;
  description: string;
}

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const catalogs: CatalogInfo[] = [
  {
    id: 1,
    title: "National Day Special",
    path: "/pdf/catalogs/National_Day_Catalogue.pdf",
    description: "Special offers for national celebrations"
  },
  {
    id: 2,
    title: "Ramadan Gifts",
    path: "/pdf/catalogs/Ramadan_Gifts.pdf",
    description: "Our Ramadan selection"
  }
];

const Services: React.FC = () => {
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogInfo | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = useWindowWidth();
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    if (selectedCatalog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCatalog]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const handleCatalogClick = useCallback((catalog: CatalogInfo) => {
    setIsLoading(true);
    setSelectedCatalog(catalog);
    setPageNumber(1);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCatalog(null);
    setNumPages(null);
    setPageNumber(1);
  }, []);

  const changePage = useCallback((offset: number) => {
    if (numPages) {
      setPageNumber(prevPageNumber => {
        const newPageNumber = prevPageNumber + offset;
        return Math.min(Math.max(1, newPageNumber), numPages);
      });
    }
  }, [numPages]);

  const pdfWidth = windowWidth > 900 ? 800 : windowWidth - 40;

  return (
    <div className={styles.servicesContainer}>
      <h1 className={styles.title}>Our Catalogs</h1>
      
      <div className={styles.catalogGrid}>
        {catalogs.map((catalog) => (
          <div 
            key={catalog.id} 
            className={styles.catalogCard}
            onClick={() => handleCatalogClick(catalog)}
          >
            <div className={styles.catalogPreview}>
              <Document
                file={catalog.path}
                loading={<div className={styles.loading}>Loading...</div>}
              >
                <Page 
                  pageNumber={1} 
                  width={200}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
            <h3>{catalog.title}</h3>
            <p>{catalog.description}</p>
          </div>
        ))}
      </div>

      {selectedCatalog && (
        <div className={styles.catalogViewer} ref={pdfContainerRef}>
          <div className={styles.viewerHeader}>
            <button 
              className={styles.backButton}
              onClick={handleCloseModal}
            >
              ← Back to catalogs
            </button>
            <h2>{selectedCatalog.title}</h2>
          </div>
          
          {isLoading && <div className={styles.loading}>Loading catalog...</div>}
          
          <div className={styles.pdfViewer}>
            <Document
              file={selectedCatalog.path}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className={styles.loading}>Loading...</div>}
            >
              <div className={styles.pdfPage}>
                <Page
                  pageNumber={pageNumber}
                  width={pdfWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </Document>
          </div>
          
          <div className={styles.navigation}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                changePage(-1);
              }} 
              disabled={pageNumber <= 1}
              className={styles.navButton}
            >
              ← Previous page
            </button>
            <span className={styles.pageInfo}>
              Page {pageNumber} of {numPages}
            </span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                changePage(1);
              }} 
              disabled={pageNumber >= (numPages || 0)}
              className={styles.navButton}
            >
              Next page →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services; 