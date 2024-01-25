export enum UploadImage {
  BROWSE = "Browse",
  AVATAR = "Avatar",
}

export class DocumentData {
  documentName: string;
  documentType: string;
  documentSide: number;
  documentNumber: number;
  fileName: string;
  fileType: string;
  verificationType: string;
}
