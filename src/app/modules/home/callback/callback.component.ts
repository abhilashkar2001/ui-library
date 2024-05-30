import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { QueryParamEnum } from "app/enum/query-param.enum";
import { ChecklistRouteObjModel } from "app/shared/models/checklist-model";
import { SessionStorageService } from "app/shared/services/session-storage.service";
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
    private router: Router,
    private sessionStorageService: SessionStorageService
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
    this.sessionService.getProfileInfo().subscribe((res) => {
      this.tokenService.saveUser(res);
      sessionStorage.setItem(
        "customerId",
        this.getParameterByName("customerId")
      );
      sessionStorage.setItem("mobile", this.getParameterByName("mobile"));
      sessionStorage.setItem(
        "ReferanceNumber",
        this.getParameterByName("referanceNumber")
      );
      sessionStorage.setItem(
        "type",
        JSON.stringify(this.getParameterByName("type"))
      );
      this.sessionStorageService.setScreenId(
        this.getParameterByName(QueryParamEnum.SCREEN_ID)
      );
      if (this.getParameterByName(QueryParamEnum.CHECKLIST_ITEM)) {
        const checklistObj: ChecklistRouteObjModel = {
          checklistItem: this.getParameterByName(QueryParamEnum.CHECKLIST_ITEM),
          processStageId: this.getParameterByName(
            QueryParamEnum.PROCESS_STAGE_ID
          ),
          screenId: this.getParameterByName(QueryParamEnum.SCREEN_ID),
        };
        this.sessionStorageService.setChecklistRouteObj(checklistObj);
      }
      if (
        this.getParameterByName("customerId") != null &&
        this.getParameterByName("mobile") != null
      ) {
        this.router.navigate([`/origination/otp`], {
          queryParams: { type: `${this.getParameterByName("screen")}` },
        });
      } else {
        sessionStorage.setItem(
          "originationId",
          JSON.stringify(this.getParameterByName("originationId"))
        );

        this.router.navigate([
          `/origination/${this.getParameterByName("route")}`,
        ]);
      }
    });
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
