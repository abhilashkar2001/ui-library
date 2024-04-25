import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
})
export class WarningComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { error: string; message: string }
  ) {}

  ngOnInit(): void {}
}
