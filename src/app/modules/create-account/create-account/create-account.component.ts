import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent implements OnInit {
  constructor() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }

  ngOnInit(): void {}
}
