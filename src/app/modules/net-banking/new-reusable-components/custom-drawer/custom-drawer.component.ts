import { FlatTreeControl } from "@angular/cdk/tree";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from "@angular/material/tree";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DrawerConstant } from "./custom-drawer.constant";

@Component({
  selector: "app-custom-drawer",
  templateUrl: "./custom-drawer.component.html",
  styleUrls: ["./custom-drawer.component.scss"],
})
export class CustomDrawerComponent implements OnInit {
  TREE_DATA: any[] = DrawerConstant.DRAWER_MENU;
  currentMenu = "";

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource.data = this.TREE_DATA;
    this.matIconRegistry.addSvgIcon(
      `sidenav-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/sidenav_icon.svg"
      )
    );
  }

  ngOnInit(): void {}

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      roleName: node.roleName,
      path: node.path,
      id: node?.id,
    };
  };

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: any) => node.expandable;

  getNode(node) {
    this.currentMenu = node.name;
    if (node.path) {
      this.router.navigate([`user/dashboard/trade/${node.path}`], {
        queryParams: { type: node.id },
      });
    }
    this.cdr.detectChanges();
  }
}
