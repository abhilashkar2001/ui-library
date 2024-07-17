import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { OriginationService } from 'app/shared/services/origination.service';

@Component({
  selector: 'app-staging-success-area',
  templateUrl: './staging-success-area.component.html',
  styleUrls: ['./staging-success-area.component.scss'],
})
export class StagingSuccessAreaComponent implements OnInit {
 @Input() originationId:any;
 @Input() isComplete:any;
  updatedResult: any[] = [];
  constructor(private originationSVC:OriginationService,
     private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes?.isComplete.currentValue == true){
      this.fetchCompletedStages();
    } 
  }

  fetchCompletedStages(){
    let interval = setInterval(()=>{
      this.originationSVC.getCompletedtages(this.originationId).subscribe((res)=>{
        if(res){
          let i = res?.data.findIndex((e)=> e.moduleStatus == "INPROGRESS");
          if(i > -1 ){
            clearInterval(interval)
          }
          this.updatedResult = res?.data
          this.cdr.detectChanges();
        }
      })
    }, 1000)
  }
}
