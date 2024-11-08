import { Component, OnInit } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";

@Component({
  selector: "app-info-popup",
  templateUrl: "./info-popup.component.html",
  styleUrls: ["./info-popup.component.scss"],
})
export class InfoPopupComponent implements OnInit {
  interestdetailsArray: any[] = [];
  dataSource = new MatTableDataSource();
  data = [];
  constructor(
    private dialogRef: MatDialogRef<InfoPopupComponent>,
    private newdepositService: NewDepositService
  ) {}

  ngOnInit(): void {
    this.getinterestdetails();
  }
  getinterestdetails() {
    this.newdepositService.getInterestDetails().subscribe((res) => {
      this.interestdetailsArray = res;
      for (const key in this.interestdetailsArray[0]) {
        this.data.push(key);
      }
      console.log(this.data);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
