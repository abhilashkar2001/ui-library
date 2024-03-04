import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "app/shared/session.service";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  profileRes: any;
  constructor(
    private sessionService: SessionService,
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onInit();
  }

  /**
   * Onint
   */
  onInit() {
    /* send username and password to get Access Token */
    let payload = {
      username: "CREATOR",
      password: "Newuser@1",
    };
    let isRememberMe = true;
    let otpRequired = false;

    this.sessionService.signin(payload, isRememberMe, otpRequired).subscribe(
      (_) => {
        /* get profile info */
        this.getProfile();
      },
      (err) => {
        this.router.navigate(["/home/401"]);
      }
    );
  }

  /**
   * @method getProfile()
   */
  getProfile() {
    this.sessionService.getProfileInfo().subscribe(
      (res) => {
        this.profileRes = res;
        this.tokenService.saveUser(this.profileRes);
        this.router.navigate(["/account"]);
      },
      (err) => {}
    );
  }
}
