import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-reusable-nodatafound",
  templateUrl: "./reusable-nodatafound.component.html",
  styleUrls: ["./reusable-nodatafound.component.scss"],
})
export class ReusableNodatafoundComponent implements OnInit {
  @Input("displayLabel") displayLabel: any;
  @Input("displayExternalLink") displayExternalLink: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
