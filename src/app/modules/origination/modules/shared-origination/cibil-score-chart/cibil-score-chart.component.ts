import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-cibil-score-chart',
  templateUrl: './cibil-score-chart.component.html',
  styleUrls: ['./cibil-score-chart.component.scss'],
})
export class CibilScoreChartComponent implements AfterViewInit {
  @Input() cibilScore: number | any;

  cibilScoreList = [
    {
      score: 'Below 681',
      description: 'Need Help',
      colorCode: '#D57066',
    },
    {
      score: '681 - 730',
      description: 'Average',
      colorCode: '#DF9690',
    },
    {
      score: '771 - 770',
      description: 'Fair',
      colorCode: '#E4A037',
    },
    {
      score: '771 - 790',
      description: 'Good',
      colorCode: '#62BB69',
    },
    {
      score: 'Above 791',
      description: 'Excellent',
      colorCode: '#D57066',
    },
  ];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.animateCibilScore(this.cibilScore);
  }

  cibilScoreText() {
    if (this.cibilScore < 681) {
      return 'Poor';
    } else if (this.cibilScore > 681 && this.cibilScore <= 730) {
      return 'Average';
    } else if (this.cibilScore > 730 && this.cibilScore <= 770) {
      return 'Fair';
    } else if (this.cibilScore > 770 && this.cibilScore <= 790) {
      return 'Good';
    } else {
      return 'Excellent';
    }
  }

  animateCibilScore(cibilScore: any) {
    const markerContainer =
      this.el.nativeElement.querySelector('.marker_container');
    let progressStartValue = 300;
    const progressEndValue = cibilScore ? cibilScore : 300;
    const speed = 1;

    const mapRange = (
      value: number,
      inMin: number,
      inMax: number,
      outMin: number,
      outMax: number,
    ): number => {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    };

    const progress = setInterval(() => {
      progressStartValue++;
      const degrees = mapRange(progressStartValue, 300, 900, 0, 180);
      this.renderer.setStyle(
        markerContainer,
        'transform',
        `translate(-50%, -50%) rotate(${degrees}deg)`,
      );

      if (progressStartValue >= progressEndValue) {
        clearInterval(progress);
      }
    }, speed);
  }
}
