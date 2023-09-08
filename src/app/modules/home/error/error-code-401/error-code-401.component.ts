import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-error-code-401",
  templateUrl: "./error-code-401.component.html",
  styleUrls: ["./error-code-401.component.scss"],
})
export class ErrorCode401Component implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  back(): void {
    this.router.navigateByUrl("/home");
  }
}
