import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FileModel } from '@onerumango/utils/lib/models/file.model';

@Component({
  selector: 'app-view-doc-side-panel',
  templateUrl: './view-doc-side-panel.component.html',
  styleUrls: ['./view-doc-side-panel.component.scss'],
})
export class ViewDocSidePanelComponent implements OnChanges {
  @Input() isSideNavOpen = false;
  @Input() documents: FileModel[] = [];
  @Output() close = new EventEmitter<void>();

  currentDocumentIndex = 0;
  imageLoadError = false;
  documentSize = 'N/A';
  private fileSizeCache = new Map<string, string>();

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['documents'] || changes['isSideNavOpen']) {
      this.updateDocumentSize();
    }
  }

  nextDocument() {
    if (this.currentDocumentIndex < this.documents.length - 1) {
      this.currentDocumentIndex++;
      this.imageLoadError = false;
      this.updateDocumentSize();
    }
  }

  previousDocument() {
    if (this.currentDocumentIndex > 0) {
      this.currentDocumentIndex--;
      this.imageLoadError = false;
      this.updateDocumentSize();
    }
  }

  deleteDocument(doc: FileModel) {
    const index = this.documents.indexOf(doc);
    this.documents = this.documents.filter((d) => d !== doc);

    if (this.currentDocumentIndex >= this.documents.length) {
      this.currentDocumentIndex = Math.max(0, this.documents.length - 1);
    } else if (index < this.currentDocumentIndex) {
      this.currentDocumentIndex--;
    }

    this.imageLoadError = false;
    this.updateDocumentSize();
  }

  closeSideNav() {
    this.close.emit();
  }

  /**
   * Updates the documentSize property for the current document.
   * Tries base64 first, then attempts to fetch size from fileUrl.
   */
  private updateDocumentSize(): void {
    const doc = this.documents[this.currentDocumentIndex];
    if (!doc) {
      this.documentSize = 'N/A';
      return;
    }

    // If fileData (base64) is present, calculate size
    if (doc.fileData) {
      this.documentSize = this.getReadableFileSizeFromBase64(doc.fileData);
      return;
    }

    // If fileUrl is present, try to get size from cache or via HTTP HEAD
    if (doc.fileUrl) {
      if (this.fileSizeCache.has(doc.fileUrl)) {
        this.documentSize = this.fileSizeCache.get(doc.fileUrl)!;
        return;
      }

      this.documentSize = 'Loading...';
      this.http.head(doc.fileUrl, { observe: 'response' }).subscribe({
        next: (res) => {
          const contentLength = res.headers.get('Content-Length');
          if (contentLength) {
            const size = this.formatBytes(parseInt(contentLength, 10));
            this.fileSizeCache.set(doc.fileUrl!, size);
            this.documentSize = size;
          } else {
            this.documentSize = 'Unknown Size';
          }
        },
        error: () => {
          this.documentSize = 'Unknown Size';
        },
      });
      return;
    }

    this.documentSize = 'N/A';
  }

  /**
   * Calculates readable file size from a base64 string.
   */
  private getReadableFileSizeFromBase64(base64: string): string {
    const sizeInBytes =
      base64.length * (3 / 4) -
      (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
    return this.formatBytes(sizeInBytes);
  }

  /**
   * Formats bytes as a human-readable string.
   */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
