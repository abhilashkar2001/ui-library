import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

export class FileHandle {
  files: File | any;
  name: string | any;
}
@Directive({
  selector: "[appDragDrop]"
})
export class DragDropDirective {
  acceptableFile = ["jpeg", "jpg", "png"];
  error: string | any;
  constructor() {}
  @Output() onFileDropped = new EventEmitter<any>();

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    console.log(event.dataTransfer.files, "dataTransfer");
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && this.checkAcceptability(event)) {
      let files: FileList | any = event.dataTransfer.files;
      console.log(files);
      let exportfile = new FileHandle();
      exportfile.files = files[0];
      exportfile.name = files[0].name;
      this.onFileDropped.emit(exportfile);
    } else {
      alert("Please drop proper document format");
    }
  }

  checkAcceptability(event: any) {
    for (const value of this.acceptableFile) {
      if (event.dataTransfer.files[0].name.toLowerCase().includes(value)) {
        return true;
      }
    }
    return false;
  }
}
