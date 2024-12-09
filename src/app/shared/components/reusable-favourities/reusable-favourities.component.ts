import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-reusable-favourities",
  templateUrl: "./reusable-favourities.component.html",
  styleUrls: ["./reusable-favourities.component.scss"]
})
export class ReusableFavouritiesComponent implements OnInit {
  @Output() rediectTo: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: any[] | any;
  profileName = "payeeName";
  favouritesCard: any[] = [];
  constructor() {}

  ngOnInit(): void {
    // this.getFavouritiesData();
  }
  redirectTo(event: any) {
    this.rediectTo.emit(event);
  }
  getData(e: any) {
    return e ? `${e[0]?.toUpperCase()}` : "";
  }

  // getFavouritiesData() {
  //   let payload: any = {
  //     isFavorite: true,
  //   };
  //   this.service.getTransferDetails(payload).subscribe((res: any) => {
  //     if (res?.statusCode === 200) {
  //       this.favouritesCard = res?.data;
  //     }
  //   });
  // }
}
