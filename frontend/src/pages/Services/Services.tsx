import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './Services.module.scss';
import kiosk from '../../assets/images/services/acai-kiosk-small.jpg';
import exhibition from '../../assets/images/services/exhibition.jpg';
import gifts from '../../assets/images/services/corporate-gifts.jpg';
import architecture from '../../assets/images/services/indoor-2595820_640.jpg';
import awards from '../../assets/images/services/achievement-4269756_640.jpg';
import signage from '../../assets/images/services/architecture-2562433_640.jpg';

interface ServiceInfo {
  id: number;
  title: string;
  description: string;
  image: string;
  isMain?: boolean;
}

const mainServices: ServiceInfo[] = [
  {
    id: 1,
    title: "Indoor & Outdoor Kiosk",
    description: "We provide a bespoke solution by engaging our clients throughout the entire design process. A comprehensive - and - personal - dialogue allows us to ensure that each design addresses the client's exact needs, promising the perfect fusion of visual and practical considerations. Our main areas of expertise consist of concept design and feasibility, space analysis, design consultancy, design and build, project management, and fit out management.",
    image: kiosk,
    isMain: true
  },
  {
    id: 2,
    title: "Exhibition Standard",
    description: "Our designers don't just get brief and start to conceptualize. We value our customer so much that we take each project individually and focus on their branding and the message they want to get across their customers. We bring your company to exhibition by building your booth with your corporate identity all over the show.",
    image: exhibition,
    isMain: true
  },
  {
    id: 3,
    title: "Corporate Gift Items",
    description: "Gift items convey your message to the customers and should have a touch of your company's core products and services. It is easy to make a perfect gift when choosing from a wide array of comprehensive product catalogue. Our gift items covers all major product categories from functional items, traditional, new technology gadgets and accessories allowing you to find the item that best will represent your company to your customers.",
    image: gifts,
    isMain: true
  }
];

const additionalServices: ServiceInfo[] = [
  {
    id: 4,
    title: "Architecture & Interiors",
    description: "Professional architectural and interior design solutions.",
    image: architecture
  },
  {
    id: 5,
    title: "Awards & Trophies",
    description: "Custom-made awards and trophies for special recognition.",
    image: awards
  },
  {
    id: 6,
    title: "Stands & Signage",
    description: "Additional specialized services tailored to your needs.",
    image: signage
  }
];

interface CatalogInfo {
  id: number;
  title: string;
  description: string;
  path: string;
}

const catalogs: CatalogInfo[] = [
  {
    id: 1,
    title: "National Day Special",
    description: "Discover our exclusive collection for national celebrations.",
    path: "/pdf/catalogs/National_Day_Catalogue.pdf"
  },
  {
    id: 2,
    title: "Ramadan Gifts",
    description: "Browse our special Ramadan gift selection.",
    path: "/pdf/catalogs/Ramadan_Gifts.pdf"
  }
];

const Services: React.FC = () => {
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogInfo | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  const handleCatalogClick = (catalog: CatalogInfo, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedCatalog(catalog);
    setPageNumber(1);
  };

  const handleCloseModal = () => {
    setSelectedCatalog(null);
    setPageNumber(1);
    setNumPages(null);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages || 1);
    });
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setScale(1);

  return (
    <div className={styles.servicesContent}>
      <div className={styles.servicesHeader}>
        <h3>Our Services</h3>
        <p className={styles.subtitle}>
          Discover our comprehensive range of professional services tailored to meet your needs.
        </p>
      </div>

      {/* Main Services Section */}
      <div className={styles.mainServices}>
        {mainServices.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.serviceImage}>
              <img src={service.image} alt={service.title} />
            </div>
            <div className={styles.serviceContent}>
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Services Section */}
      <div className={styles.additionalServices}>
        <h4>Additional Services</h4>
        <div className={styles.servicesGrid}>
          {additionalServices.map((service) => (
            <div 
              key={service.id} 
              className={styles.additionalServiceCard}
              style={service.image ? {
                '--service-background-image': `url(${service.image})`
              } as React.CSSProperties : undefined}
            >
              <h5>{service.title}</h5>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Catalogs Section */}
      <div className={styles.catalogsSection}>
        <h4>Our Catalogs</h4>
        <div className={styles.catalogsGrid}>
          {catalogs.map((catalog) => (
            <a 
              key={catalog.id} 
              href={catalog.path}
              onClick={(e) => handleCatalogClick(catalog, e)}
              className={styles.catalogCard}
            >
              <div className={styles.catalogContent}>
                <h5>{catalog.title}</h5>
                <p>{catalog.description}</p>
                <span className={styles.viewButton}>View Catalog</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Modal Catalog Viewer */}
      {selectedCatalog && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedCatalog.title}</h3>
              <div className={styles.controls}>
                <button 
                  className={styles.controlButton} 
                  onClick={handleZoomOut}
                  title="Zoom out"
                >
                  -
                </button>
                <button 
                  className={styles.controlButton} 
                  onClick={handleResetZoom}
                  title="Reset zoom"
                >
                  100%
                </button>
                <button 
                  className={styles.controlButton} 
                  onClick={handleZoomIn}
                  title="Zoom in"
                >
                  +
                </button>
                <button 
                  className={styles.closeButton} 
                  onClick={handleCloseModal}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className={styles.modalContent}>
              <Document
                file={selectedCatalog.path}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading catalog...</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                    </div>
                  }
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className={styles.pageButton}
              >
                ‹ Previous
              </button>
              <span className={styles.pageInfo}>
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= (numPages || 0)}
                className={styles.pageButton}
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services; 