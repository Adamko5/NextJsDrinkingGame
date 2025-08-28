import React, { useEffect } from 'react';
import styles from './Modal.module.css';

export interface ModalProps {
  /**
   * Controls whether the modal is visible.  When `false` the
   * component returns `null`.
   */
  isOpen: boolean;
  /** Optional title displayed in the header. */
  title?: string;
  /** The modal body content. */
  children?: React.ReactNode;
  /**
   * Called when the modal requests to close (e.g. when the close
   * button is clicked or Escape is pressed).  Consumers should set
   * `isOpen` to `false` in response.
   */
  onClose: () => void;
  /**
   * Optional actions rendered in the footer (e.g. OK/Cancel buttons).
   */
  actions?: React.ReactNode;
}

/**
 * A reusable modal dialog component.  It renders an overlay and
 * centred panel with a header, body and optional footer.  Focus
 * trapping is not implemented here, but Escape key handling and
 * backdrop click closing are supported.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, actions }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation() /* prevent closing when clicking inside the dialog */}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button className={styles.close} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;