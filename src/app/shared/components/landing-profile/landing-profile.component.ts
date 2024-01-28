import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  @Output() customApply = new EventEmitter<any>();

  constructor(private router: Router) {}

  ngOnInit(): void {}
  apply() {
    if (this.profileHeader.toLowerCase().includes("loan"))
      this.router.navigate([`${this.routeUrl}`]);
  }

  onApply(e) {
    this.customApply.emit(e);
  }
}
