import { Component, OnInit } from "@angular/core";
import { NewDepositService } from "app/views/home/new-deposit/new-deposit.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  hideNavItem: boolean = false;
  constructor(private showSideBar: NewDepositService) {}

  ngOnInit(): void {
    this.showSideBar.getToken().subscribe((resp) => {
      this.hideNavItem = resp;
    });
  }
}
