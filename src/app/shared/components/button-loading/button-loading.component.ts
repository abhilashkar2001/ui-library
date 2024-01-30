import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "button-loading",
  templateUrl: "./button-loading.component.html",
  styleUrls: ["./button-loading.component.scss"],
})
export class ButtonLoadingComponent implements OnInit {
  @Input("loading") loading: boolean = false;
  @Input("disable") disable: boolean = false;
  @Input("btnClass") btnClass: string = "";
  @Input("loadingText") loadingText = "Please wait";
  @Input("type") type: "button" | "submit" = "submit";

  constructor() {}

  ngOnInit() {}
}
