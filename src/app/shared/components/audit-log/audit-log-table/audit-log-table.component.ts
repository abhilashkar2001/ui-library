import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { AduitLogDetailsComponent } from "../aduit-log-details/aduit-log-details.component";
import { DataService } from "app/shared/services/table-service/data.service";
import { AuditLogPopupComponent } from "../audit-log-popup/audit-log-popup.component";

@Component({
  selector: "app-audit-log-table",
  templateUrl: "./audit-log-table.component.html",
  styleUrls: ["./audit-log-table.component.scss"],
})
export class AuditLogTableComponent implements OnInit {
  @Input() columns;
  @Input() dummyData;
  @Input() isShowCancel;
  @Input() auditInfo;
  @ViewChild(AduitLogDetailsComponent) childComponent: AduitLogDetailsComponent;
  auditlogHistory: any[];
  auditLogData: any[] = [];
  auditLogDataObject: any;

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getClickEvent().subscribe(() => {
      this.auditLogDataObject = this.dataService.getAuditLogData();

      this.auditlogHistory = this.getSortedHistory();
      this.auditLogData = [];
      this.auditLogData = this.auditlogHistory.slice(0, 2);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.auditInfo) {
      this.auditInfo = changes.auditInfo.currentValue;
      this.auditInfo = { ...this.auditInfo, page: 1, pageSize: 2 };
    }
  }

  getSortedHistory() {
    var array = this.auditLogDataObject?.data;
    var childArray = [];
    !!array?.data.length &&
      array?.data?.forEach((element) => {
        let obj = {
          ...element[0],
          action: element[2] == "MOD" ? "Modified" : "New",
        };
        childArray.push(obj);
      });
    childArray.sort(
      (a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated)
    );

    return childArray;
  }

  customExpand(event) {
    if (event.action === "dialog") {
      const dialogRef = this.dialog.open(AuditLogPopupComponent, {
        data: {
          isShowCancel: true,
          dummyData: this.auditlogHistory,
          columns: this.columns,
          auditInfo: { ...this.auditInfo, page: 1, pageSize: 5 },
        },
        disableClose: true,
        height: "450px",
        width: "80%",
        panelClass: "auditLogClass",
        backdropClass: "auditLog-backdrop",
      });
    }
  }
  getAuditHistory(data: any = "") {
    this.childComponent.getAuditDetails(data);
  }
}
