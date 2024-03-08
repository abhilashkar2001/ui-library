import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from "@angular/material/tree";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-custom-drawer",
  templateUrl: "./custom-drawer.component.html",
  styleUrls: ["./custom-drawer.component.scss"],
})
export class CustomDrawerComponent implements OnInit {
  TREE_DATA: any[] = [
    {
      name: "Transaction",
      path: "",
      roleName: "parent-node",
      children: [
        {
          name: "BG Issuance",
          path: "",
          roleName: "child-node",
          children: [
            { name: "BG Issuance", path: "" },
            { name: "BG Amendment", path: "" },
            { name: "BG Physical Amedment", path: "" },
          ],
        },
        { name: "LETTER OF CREDIT", path: "", roleName: "child-node" },
        { name: "REMITTANCE", path: "", roleName: "child-node" },
        { name: "BILLS PROCESSING", path: "", roleName: "child-node" },
        { name: "EXPORTS PROCESSING", path: "", roleName: "child-node" },
        { name: "BUYERS CREDIT", path: "", roleName: "child-node" },
        { name: "EXPORT BILL DISPATCH", path: "", roleName: "child-node" },
        { name: "EXPORT S/W BILL LODGEMENT", path: "", roleName: "child-node" },
        { name: "EEFC", path: "", roleName: "child-node" },
      ],
    },
    {
      name: "Beneficiary Maintenance",
      path: "",
      roleName: "parent-node",
    },
  ];

  currentItem = "";

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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

  showNode(n) {
    console.log(n, "..........");
  }
}
