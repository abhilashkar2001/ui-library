import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

export abstract class DocumentUploadFormGroup {
  _parentForm: FormGroup | any;

  constructor(protected fb: FormBuilder) {}

  /**
   * this is the control for document form array
   * @param index
   * @returns the control of document in customer form array
   */
  get documentCtrl(): FormArray | any {
    return this._parentForm.get('documents') as FormArray;
  }

  /**
   * build document form array
   * @param data
   * @returns the formgorup to be pushed in document form array in customer form array
   */
  documentFormArray(data?: any): FormGroup {
    return this.fb.group({
      documentName: [data?.documentName ?? '', [Validators.required]],
      isProofOfAddress: [data?.isProofOfAddress ?? ''],
      files: this.fb.array([]),
    });
  }

  /**
   * control for the files present in particular document
   * @param index
   * @param documentIndex
   * @returns retuns the form control of file in document form array
   */
  documentFilesCtrl(documentIndex: number): FormArray {
    return this.documentCtrl.at(documentIndex).get('files') as FormArray;
  }

  /**
   * method is used to build the file form group for particular document
   * @param data of the uploaded file details
   * @returns return the file form group
   */
  documentFileFormArray(data?: any) {
    return this.fb.group({
      fileName: [data?.fileName ?? ''],
      fileUrl: [data?.fileUrl ?? ''],
      documentId: [data?.documentId ?? null, [Validators.required]],
    });
  }

  /**
   * push document info to the document form fetching for the customer
   * @param element document data of the particular customer
   * @param index index of the customer in customer form array
   */
  pushDocumentInfo(element?: any) {
    if (
      element?.documnentsInfo &&
      element?.documnentsInfo?.documents?.length > 0
    ) {
      this.documentCtrl.clear();
      element?.documnentsInfo?.documents.forEach(
        (document: any, docIndex: number) => {
          this.documentCtrl.push(this.documentFormArray(document.docs[0]));
          if (document?.docs?.length > 0) {
            document?.docs?.forEach((item: any) => {
              this.documentFilesCtrl(docIndex).push(
                this.documentFileFormArray(item),
              );
            });
          }
        },
      );
    } else {
      this.documentCtrl.push(this.documentFormArray());
    }
  }
}
