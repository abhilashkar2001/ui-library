import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { OriginationService } from 'app/shared/services/origination.service';

@Component({
  selector: 'app-staging-success-area',
  templateUrl: './staging-success-area.component.html',
  styleUrls: ['./staging-success-area.component.scss'],
})
export class StagingSuccessAreaComponent implements OnInit {
 @Input() originationId:any;
  updatedResult: any[] = [];
  constructor(private originationSVC:OriginationService,
     private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchCompletedStages();
  }
  fetchCompletedStages(){
    this.originationSVC.getCompletedtages(this.originationId).subscribe((res)=>{
      if(res){
        res?.data.map((e)=> this.updatedResult.push(e));
        this.cdr.detectChanges();
      }
    })
  }
}
