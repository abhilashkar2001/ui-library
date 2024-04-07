import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reusable-footer',
  templateUrl: './reusable-footer.component.html',
  styleUrls: ['./reusable-footer.component.scss']
})
export class ReusableFooterComponent implements OnInit {
  @Output () saveTemplet = new EventEmitter<any>();
  @Output () saveorSubmit = new EventEmitter<{submitType:any}>();
  constructor() { }

  ngOnInit(): void {
  }
  saveAsTemplet(){
    this.saveTemplet.emit("Templet")
  }
  updateRecord(operation){
    this.saveorSubmit.emit({submitType:operation})
  }
}
