import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "app/shared/session.service";
import { TokenStorageService } from "app/shared/token-storage.service";
@Component({
  selector: "app-callback",
  templateUrl: "./callback.component.html",
  styleUrls: ["./callback.component.scss"],
})
export class CallbackComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    sessionStorage.clear();
    localStorage.clear();
    let codeIndex = window.location.href.indexOf("code");
    if (codeIndex != -1) {
      let accessToken = this.getParameterByName("code");
      this.tokenService.saveToken(accessToken);
      this.getProfile();
    } else {
      window.location.href = "https://192.168.0.127:4204/";
    }
  }

  /**
   * @method getProfile()
   */
  getProfile() {
    this.sessionService.getProfileInfo().subscribe(
      (res) => {
        this.tokenService.saveUser(res);
        sessionStorage.setItem("customerId", this.getParameterByName("customerId"));
        sessionStorage.setItem("mobile", this.getParameterByName("mobile"));
        sessionStorage.setItem("ReferanceNumber",this.getParameterByName("referanceNumber"));
        if( this.getParameterByName("customerId") != null && this.getParameterByName("mobile") != null  ){ this.router.navigate([`/origination/otp`],{queryParams: {type:`${this.getParameterByName("screen")}`}})}
        else{sessionStorage.setItem(
          "originationId",
          JSON.stringify(this.getParameterByName("originationId"))
        );
        this.router.navigate([
          `/origination/${this.getParameterByName("route")}`,
        ]);}
      },
      (err) => {
        // TODO error hanndler
      }
    );
  }

  getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
