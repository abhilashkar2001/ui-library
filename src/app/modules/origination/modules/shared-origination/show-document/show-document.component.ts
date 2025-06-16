import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewLoanDocComponent } from '../view-loan-doc/view-loan-doc.component';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-document',
  templateUrl: './show-document.component.html',
  styleUrls: ['./show-document.component.scss'],
})
export class ShowDocumentComponent implements OnInit {
  @Input() document: any;
  endPoints = environment.microServiceURL;
  filePreview: any;

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.endPoints + this.document?.fileUrl,
    );
  }

  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/account-img1.png';
    } else {
      if (url.endsWith('pdf') || url.endsWith('xlsx') || url.endPoints('csv')) {
        return 'assets/images/file_icon.svg';
      } else
        return this.sanitizer.bypassSecurityTrustUrl(`${this.endPoints}${url}`);
    }
  }

  viewFiles(imageUrl: any, imageName: any): void {
    const fileName = imageName?.fileName;
    const extension = fileName?.split('.').pop()?.toLowerCase();
    if (extension == 'xlsx' || extension == 'csv' || extension == 'xls') {
      this.handleExcelFile(this.endPoints + imageName.fileUrl, fileName);
    } else {
      imageUrl;
      this.dialog.open(ImageDialogComponent, {
        data: {
          imageUrl: this.endPoints + imageName.fileUrl,
          imageName: imageName.fileName,
          fileInfo: imageName,
        },
        width: '60%',
        height: '560px',
        panelClass: 'imageViewDialog',
      });
    }
  }

  handleExcelFile(fileUrl: string, fileName: string) {
    this.http
      .get(encodeURI(fileUrl), { responseType: 'arraybuffer' })
      .subscribe((data: any) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error('No sheet name found in the Excel file.');
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error('Worksheet not found in the Excel file.');
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];

        const headerRow = jsonData.find(
          (row) =>
            Array.isArray(row) && row.filter((cell) => !!cell).length > 1,
        );

        if (!headerRow) {
          throw new Error('No valid header row found.');
        }

        const tableHeader: string[] = headerRow
          .map((h) => (h ?? '').toString().trim())
          .filter((h) => !!h);

        const headerIndex = jsonData.indexOf(headerRow);

        const tableBody = jsonData
          .slice(headerIndex + 1)
          .filter((row) => Array.isArray(row) && row.length > 0)
          .map((row: any[], rowIndex: number) => {
            try {
              const entries = tableHeader.map((h: string, i: number) => [
                h,
                row[i] ?? '',
              ]);
              return Object.fromEntries(entries);
            } catch (e) {
              console.error(
                `Error processing row ${headerIndex + rowIndex + 1}:`,
                row,
              );
              return {};
            }
          });

        this.dialog.open(ViewLoanDocComponent, {
          data: {
            tableHeader,
            tableBody,
            fileName,
          },
          width: '80%',
          panelClass: 'excelViewDialog',
        });
      });
  }
}
