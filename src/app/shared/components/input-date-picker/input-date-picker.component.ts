import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChange,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import {
  MatCalendarCellClassFunction,
  MatDatepickerInputEvent,
} from "@angular/material/datepicker";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { createMask } from "app/shared/directives/input-mask/constants";
import { pluckOnlyDate } from "app/shared/helpers/utils";
import { CustomerServiceService } from "app/shared/services/customer-service.service";
import { DateTimeService } from "app/shared/services/date-time/date-time.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-input-date-picker",
  templateUrl: "./input-date-picker.component.html",
  styleUrls: ["./input-date-picker.component.scss"],
})
export class InputDatePickerComponent implements OnInit {
  @Input() control: FormControl = new FormControl();
  @Input() inputLabel: string;
  @Input() minDate: Date;
  @Input() minDateDesc: string;
  @Input() maxDate: Date;
  @Input() maxDateDesc: string;
  @Input() mandatory: string;
  refactoredMinDate: Date;

  dateMask: any;
  controlValue: any;

  currentUser: any;
  holidayInfo: any[] = [];
  selectedYear: number = new Date().getFullYear();

  dateClass: MatCalendarCellClassFunction<Date> = (date, view) => {
    const cellDate = new Date(date);
    if (cellDate.getFullYear() !== this.selectedYear) {
      return "";
    }
    if (view === "month") {
      const monthIndex = cellDate.getMonth();
      const dayOfMonth = cellDate.getDate();
      const monthData = this.holidayInfo[monthIndex];
      if (monthData) {
        const holidays = monthData.holidays.split(",").map(Number);
        return holidays.includes(dayOfMonth) ? "custom-date-class" : "";
      }
    }
    return "";
  };

  constructor(
    private dateService: DateTimeService,
    private cdr: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private customerservice: CustomerServiceService,
    private tokenStorageService: TokenStorageService
  ) {
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/calendar.svg"
      )
    );
    this.dateMask = createMask<Date>({
      alias: "datetime",
      inputFormat: this.dateService?.format?.toLocaleLowerCase(),
      formatter: (value: string) => {
        return moment(value).format(this.dateService?.format);
      },
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.populateDate();
    // this.getYearlyHolidays(this.selectedYear);
  }

  initEvents(): void {
    const handleClick = () => {
      const displayedYearElement = document.querySelector(
        ".mat-calendar-period-button"
      );
      if (displayedYearElement) {
        const displayedYearText = displayedYearElement.textContent.trim();

        // Extract the year from the displayed year text
        const yearMatch = displayedYearText.match(/\d{4}/);
        if (yearMatch && yearMatch.length > 0) {
          const displayedYear = parseInt(yearMatch[0], 10);
          if (displayedYear != this.selectedYear) {
            this.getYearlyHolidays(displayedYear);
            this.selectedYear = displayedYear;
          }
        } else {
          console.error(
            "Failed to extract year from displayed year text:",
            displayedYearText
          );
        }
      }
    };

    setTimeout(() => {
      const prev = document.querySelector(".mat-calendar-previous-button");
      const next = document.querySelector(".mat-calendar-next-button");

      if (prev) {
        prev.addEventListener("click", handleClick);
      }

      if (next) {
        next.addEventListener("click", handleClick);
      }
    }, 150);
  }

  /**This will extract the year after changing the year from calender and pass to the holiday api*/
  onYearSelected(year: any) {
    this.selectedYear = moment(year).year();
    this.getYearlyHolidays(this.selectedYear);
  }

  /**Year wise holidays will populate in every month of the calender */
  getYearlyHolidays(selectedYear) {
    this.holidayInfo = [];
    this.customerservice
      .getHolidayDates(this.currentUser.branchCode, selectedYear)
      .subscribe((res: any) => {
        if (res?.statusCode == 200) {
          this.holidayInfo = res?.data?.monthlyInfo;
        }
      });
  }

  /**
   * @method dateDispatchEventEvent():void
   * @param key
   * @param event
   */
  dateDispatchEvent(event: MatDatepickerInputEvent<Date>) {
    let convertDate = pluckOnlyDate(event?.value);
    this.control?.patchValue(convertDate);
  }
  populateDate() {
    setTimeout(() => {
      if (this.control.value) {
        this.control?.patchValue(pluckOnlyDate(this.control.value));
      } else this.control?.patchValue(null);
    }, 1000);
    if (this.mandatory.toLowerCase() == "required") {
      setTimeout(() => {
        this.control?.setErrors({ matDatepickerParse: null });
        this.control?.clearValidators();
        this.control?.setValidators([Validators.required]);
        this.control?.updateValueAndValidity();
        this.cdr.markForCheck();
      }, 1000);
    } else {
      setTimeout(() => {
        this.control?.setErrors({ matDatepickerParse: null });
        this.control?.clearValidators();
        this.control?.updateValueAndValidity();
        this.cdr.markForCheck();
      }, 500);
    }
  }

  checkError() {
    this.control.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe(
        (response: Date) => {
          if (response) {
            const date1 = new Date(response);

            if (this.minDate) {
              const date2 = new Date(this.minDate);
              if (date1 < date2) {
                this.control.setErrors({ minDate: true });
              }
            }
            if (this.maxDate) {
              const date2 = new Date(this.maxDate);
              if (date1 > date2) {
                this.control.setErrors({ maxDate: true });
              }
            }
          }
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  }
}
