import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goods-info',
  templateUrl: './goods-info.component.html',
  styleUrls: ['./goods-info.component.scss']
})
export class GoodsInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("goods-info");

  }

}
