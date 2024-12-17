import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ic-toggle-slide',
  templateUrl: './ic-toggle-slide.component.html',
  styleUrls: ['./ic-toggle-slide.component.scss'],
})
export class IcToggleSlideComponent implements OnInit {
  @Input() label!: string;
  @Input() control: FormControl<boolean> | any = new FormControl<boolean>(
    false,
  );
  @Input() labelPosition!: string | any;

  constructor() {}

  ngOnInit(): void {}
}
