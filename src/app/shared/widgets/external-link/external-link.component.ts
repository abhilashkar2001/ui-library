import { Component, Input, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Router } from "@angular/router";
import { ReusableNodatafoundComponent } from "app/shared/components/reusable-nodatafound/reusable-nodatafound.component";

@Component({
  selector: "app-external-link",
  templateUrl: "./external-link.component.html",
  styleUrls: ["./external-link.component.scss"],
})
export class ExternalLinkComponent implements OnInit {
  @Input("title") title;
  @Input("types") types: string[];
  @Input("screenName") screenName;

  constructor(private router: Router, private dialog: MatDialog) {
    console.log(this.types);
  }

  ngOnInit(): void {}

  route(route: string, screenName: string) {
    if (route.startsWith("https://")) window.open(route);
    else if (route == "")
      this.dialog.open(ReusableNodatafoundComponent, {
        data: screenName,
        width: "40%",
        height: "auto",
        disableClose: true,
      });
    else this.router.navigate([route]);
  }
}
