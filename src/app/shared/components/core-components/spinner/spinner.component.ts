import { Component, OnInit } from "@angular/core";
import { LoaderService } from "app/shared/services/loader.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent implements OnInit {
  show: boolean | any;
  typeSelected: string | any;
  constructor(
    private _loaderService: LoaderService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this._loaderService.loadState.subscribe((res) => {
      if (res) this.spinner.show();
      else this.spinner.hide();
    });
    // this.spinner.show();
  }
}
