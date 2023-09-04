import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing-profile",
  templateUrl: "./landing-profile.component.html",
  styleUrls: ["./landing-profile.component.scss"],
})
export class LandingProfileComponent implements OnInit {
  @Input() imageUrl;
  @Input() profileHint;
  @Input() profileHeader;
  @Input() routeUrl;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  apply() {
    this.router.navigate([`${this.routeUrl}`]);
  }
}
