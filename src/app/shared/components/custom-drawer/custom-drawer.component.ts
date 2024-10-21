import { FlatTreeControl } from "@angular/cdk/tree";
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
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
export class CustomDrawerComponent implements OnInit, OnChanges {
  @Input() menuType: string;
  TREE_DATA: any[] = [];
  currentMenu = "";

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.matIconRegistry.addSvgIcon(
      `sidenav-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/sidenav_icon.svg"
      )
    );
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuType']) {
      this.setTreeData()
    }
  }


  setTreeData() {
    if (this.menuType == 'trade') {
      this.TREE_DATA = DrawerConstant.DRAWER_MENU;
    } else if (this.menuType == 'loan') {
      this.TREE_DATA = DrawerConstant.LOAN_DRAWER_MENU;
    }
    this.dataSource.data = this.TREE_DATA
    this.cdr.markForCheck()
  }


  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      roleName: node.roleName,
      path: node.path,
      id: node?.id,
      children: node.children || []
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
      this.router.navigate([`user/trade/${node.path}`], {
        queryParams: { type: node.name },
      });
    }
    this.cdr.detectChanges();
  }
}
