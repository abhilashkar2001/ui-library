import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DataService } from "app/shared/services/table-service/data.service";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-new-auditlog-button-group",
  templateUrl: "./new-auditlog-button-group.component.html",
  styleUrls: ["./new-auditlog-button-group.component.scss"],
})
export class NewAuditlogButtonGroupComponent implements OnInit, OnChanges {
  @Input() isEdit;
  @Input() istitle;
  @Input() maintTitle;
  @Input() auditLogData;
  @Input() hideDelete: boolean;
  @Input() hideEdit: boolean = false;
  @Input() hideActive: boolean = false;
  @Input() hideApprove: boolean = false;
  @Input() tellerOps: boolean = false;
  @Input() isDisabledEditBtn: boolean = false;
  @Output()
  customeditRecord = new EventEmitter<{}>();
  @Output() customgoBack = new EventEmitter<{}>();
  @Output() customUpdateRecord = new EventEmitter<{ operation: any }>();
  currentUser: any;
  constructor(
    private dataService: DataService,
    public tokenStorageService: TokenStorageService,
    // private transactionService: TransactionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    if (!this.auditLogData) {
      this.dataService.getClickEvent().subscribe(() => {});
    }
  }

  editRecord() {
    this.customeditRecord.emit({});
  }
  goBack() {
    this.customgoBack.emit({});
  }
  updateRecord(operation) {
    this.customUpdateRecord.emit({ operation: operation });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.auditLogData?.currentValue) {
      this.auditLogData = changes.auditLogData.currentValue;
      console.log(this.auditLogData, "auditLogData");
    }
  }

  reverseTransaction() {
    // this.transactionService
    //   .revertTransaction(this.auditLogData?.transactionId)
    //   .subscribe((res: any) => {
    //     if (res?.statusCode === 200 && res?.data) {
    //       this.auditLogData = res?.data;
    //       this.dialog.open(AlertDialogComponent, {
    //         data: {
    //           operation: "Reverse",
    //           title: this.maintTitle,
    //           lastUpdated: this.auditLogData?.lastUpdatedBy,
    //           openSecondPop: true,
    //         },
    //         width: "720px",
    //         disableClose: true,
    //         panelClass: "popup-dialog-class",
    //         backdropClass: "bdrop",
    //       });
    //     }
    //   });
  }
}
