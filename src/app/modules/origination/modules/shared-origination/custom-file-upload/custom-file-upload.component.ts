import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss'],
})
export class CustomFileUploadComponent implements OnInit {
  createDocumentForm!: FormGroup;
  @Input() isOtherDocVisible = true;

  loanDocarr: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(data?: any) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });

    if (data?.length > 0) {
      data.forEach((item: any) => {
        this.addDocument(item);
      });
    }
    if (this.isOtherDocVisible) this.addDocument();
  }

  otherDocument(): FormArray {
    return this.createDocumentForm?.get('otherDocument') as FormArray;
  }

  addDocument(data?: any) {
    this.otherDocument().push(this.newDenom(data));
  }

  newDenom(data?: any): FormGroup {
    return this.fb.group({
      documentNumber: [''],
      documentType: [data ? data.document : ''],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
      docRequired: data?.docRequired ?? false,
    });
  }

  fileBrowseHandler(i: number) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    if (!this.isOtherDocVisible) inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file: any = target.files[0];
        this.displayImage(i, file, file.size);
        // this.uploadImage(file, i);
        const fReader = new FileReader();
        fReader.readAsDataURL(file);
      }
    });

    inputElement.click();
  }

  displayImage(indx: number, file: File, size: number): void {
    const reader = new FileReader();
    const sizeinKb = (size / 1024).toFixed(2);
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result as string;
      const fileInfoArray = this.getFileInfo(indx);
      fileInfoArray.push({
        url: result,
        name: file.name,
        progress: '100%',
        size: `${sizeinKb}kb`,
        newFileUrl: '',
        pdfUrl: '',
        imageUrl: '',
      });

      setTimeout(() => {
        fileInfoArray[fileInfoArray.length - 1].progress = '0%';
      }, 1000);
    };

    reader.readAsDataURL(file);
  }

  getFileInfo(indx: number) {
    return this.otherDocument()?.controls[indx]?.get('fileInfo')?.value || [];
  }

  removeFile(docIndex: number, fileIndex: number) {
    const files = this.otherDocument().at(docIndex).get('fileInfo')?.value;
    if (files && files.length > fileIndex) {
      files.splice(fileIndex, 1);
      this.otherDocument()
        .at(docIndex)
        .get('fileInfo')
        ?.setValue([...files]);
    }
  }

  removeDocument(index: number) {
    this.otherDocument().removeAt(index);
  }
}
