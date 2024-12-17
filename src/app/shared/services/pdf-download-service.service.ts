import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { LoanService } from './loan/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PdfDownloadServiceService {
  constructor(
    private api: LoanService,
    private snack: MatSnackBar,
  ) {}
  sendEmail(successData: any) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
      compress: true,
    });

    // PAGE FORMAT

    const body = [];
    const row = [];
    row.push(successData.cbsReferenceNo);
    row.push(successData.cifNumber);
    row.push(successData.originationId);
    row.push(successData.userReferenceNo);
    body.push(row);

    const formData = new FormData();
    formData.append('subject', 'Loan Slip');
    formData.append(
      'body',
      'Automatic Generated Loan Details. Find below attach',
    );
    formData.append('to', successData?.email);
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], 'Loan Details.pdf', {
      type: 'application/pdf',
    });
    formData.append('filePath', pdfFile, pdfFile.name);
    console.log(formData);

    //   this.api
    //     .triggerTransactionEmail(formData)
    //     .subscribe((res) => console.log(res));
    // }
  }

  Excel(data: any, title: any, headeCustom: any, actionType: any) {
    const fileData = data;
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('title');
    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Corbel',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.mergeCells('A1:D2');
    worksheet.addRow([]);

    // dynamic Download-->
    console.log(headeCustom);
    headeCustom?.forEach((item1: any) => {
      console.log(item1);
      worksheet.addRow([`${item1.title}`]).eachCell((cell) => {
        cell.fill = this.addTitleColour();
        cell.font = { color: { argb: 'FFFFFF' }, bold: true };
      });
      const loanDetailsHead: any = [];
      item1.headerInfo.forEach((item: any) => {
        loanDetailsHead.push(item.header);
      });
      const loanDetailsRow: any = [];
      item1.headerInfo.forEach((item: any) => {
        loanDetailsRow.push(
          data?.loanSummary?.[`${item1.headerKey}`][`${item.headKey}`],
        );
      });
      worksheet.addRow(loanDetailsHead).eachCell((cell) => {
        cell.fill = this.addDataCell();
        cell.border = this.addDataBorder();
      });
      worksheet.addRow(loanDetailsRow);
      worksheet.addRow([]);
    });
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      if (actionType == 'download') fs.saveAs(blob, 'loan-account');
      else {
        const pdfFile = new File([blob], 'Loan Details.xlsx', {
          type: 'application/xlsx',
        });

        // for sending the email
        console.log(pdfFile);
        const formData = new FormData();
        formData.append('subject', 'Loan Details');
        formData.append(
          'body',
          'Automatic Generated Loan Details. Find below attach',
        );
        formData.append('to', `${fileData?.loanSummary?.email}`);
        formData.append('filePath', pdfFile, pdfFile.name);
        this.api.triggerloanDetailsEmail(formData).subscribe((resp) => {
          console.log(resp);
          this.snack.open(
            `File shared successfully, please check your email.` + ' !',
            'OK',
            {
              duration: 4000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'snackbar-error',
            },
          );
        });
      }
    });
    console.log(workbook);
  }
  addDataBorder(): any {
    return {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
  addDataCell(): any {
    return {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' },
    };
  }
  addTitleColour(): any {
    return {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '004c97' },
      bgColor: { argb: 'FFFFFF' },
    };
  }
}
