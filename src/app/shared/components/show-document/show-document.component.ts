import { Component, Input, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { ImageDialogComponent } from "../image-dialog/image-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-show-document",
  templateUrl: "./show-document.component.html",
  styleUrls: ["./show-document.component.scss"],
})
export class ShowDocumentComponent implements OnInit {
  @Input() document: any;
  endPoints = environment.microServiceURL;
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log("...");
  }

  ngOnChanges(changes): void {
    console.log(changes);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  getFileUrl(url) {
    if (url.includes("https")) {
      return "assets/images/account-img1.png";
    } else {
      return `${this.endPoints}${url}`;
    }
  }
  viewFiles(imageUrl: any, imageName: any): void {
    console.log(imageName);
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl,
        imageName: imageName.fileName,
      },
      width: "900px",
      height: "560px",
      panelClass: "imageViewDialog",
    });
  }
}
