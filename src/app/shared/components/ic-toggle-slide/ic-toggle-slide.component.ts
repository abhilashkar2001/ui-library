import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-ic-toggle-slide",
  templateUrl: "./ic-toggle-slide.component.html",
  styleUrls: ["./ic-toggle-slide.component.scss"],
})
export class IcToggleSlideComponent implements OnInit {
  @Input() label!: string;
  @Input() control: FormControl<boolean> = new FormControl<boolean>(false);
  @Input("labelPosition") labelPosition!: string;

  constructor() {}

  ngOnInit(): void {}
}
