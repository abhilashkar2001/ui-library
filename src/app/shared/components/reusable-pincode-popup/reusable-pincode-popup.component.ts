import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { countryStateService } from "./countrySateCityService";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-reusable-pincode-popup",
  templateUrl: "./reusable-pincode-popup.component.html",
  styleUrls: ["./reusable-pincode-popup.component.scss"],
})
export class ReusablePincodePopupComponent implements OnInit {
  public pincodeForm: FormGroup;
  countries: any[];
  states: any[];
  cities: any[];
  pincodeExpansion: any[] = [];
  dataSource;
  emptyData = new MatTableDataSource([{ empty: "empty-row" }]);
  columns = [
    {
      columnDef: "pinCode",
      header: "Pin Code",
      cell: (element: any) => `${element.pincode}`,
    },
    {
      columnDef: "countryName",
      header: "Country",
      cell: (element: any) => `${element.countryName}`,
    },
    {
      columnDef: "stateName",
      header: "State",
      cell: (element: any) => `${element.stateName}`,
    },
    {
      columnDef: "cityName",
      header: "City",
      cell: (element: any) => `${element.cityName}`,
    },
  ];
  displayedColumns;
  totalLength: any;
  tablePageIndex: number;
  pagesize: number;
  pageIndex: number;
  filterValue: any;
  constructor(
    public dialogRef: MatDialogRef<ReusablePincodePopupComponent>,
    private fb: FormBuilder,
    private countryStateCityService: countryStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((c) => c.columnDef);
    this.buildForm();
    this.fetchAllCountry();
    this.fetchAllState();
    this.fetchAllCity();
  }

  close() {
    this.dialogRef.close();
  }

  checkNumberOnly(event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  buildForm() {
    this.pincodeForm = this.fb.group({
      countryId: [""],
      pincode: [""],
      stateId: [""],
      cityId: [""],
    });
  }

  fetchAllCountry() {
    this.countryStateCityService.fetchAuthCountry().subscribe((res: any) => {
      if (res?.statusCode === 200 && res?.data) {
        this.countries = res?.data;
      }
    });
  }

  fetchAllState() {
    this.countryStateCityService.getAllState().subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.states = res?.data;
      }
    });
  }

  fetchAllCity() {
    this.countryStateCityService.getAllCity().subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.cities = res?.data;
      }
    });
  }

  fetchStateByCountry(countryId) {
    this.states = [];
    this.cities = [];
    this.countryStateCityService
      .getStateByCountry(countryId)
      .subscribe((res) => {
        if (res?.statusCode === 200 && res?.data) {
          this.states = res?.data;
        }
      });
  }

  fetchCityByState(stateId) {
    this.cities = [];
    this.pincodeForm
      .get("countryId")
      .setValue(this.states.find((s) => s?.stateId === stateId)?.countryId);
    this.countryStateCityService.getCityByState(stateId).subscribe((res) => {
      if (res?.statusCode === 200 && res?.data) {
        this.cities = res?.data;
      }
    });
  }

  populateStateCountryByCity(cityId) {
    const city = this.cities.find((s) => s?.cityId === cityId);
    this.pincodeForm.get("countryId").setValue(city?.countryId);
    this.pincodeForm.get("stateId").setValue(city?.stateId);
  }

  fetchResultArray() {
    this.countryStateCityService
      .fetchZipcodeList(this.pincodeForm.value, this.pageIndex, this.pagesize)
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          this.updateTable(res.data, res.meta);
        } else {
          this.updateTable([], 0);
        }
      });
  }

  updateTable(data, meta) {
    this.totalLength = meta?.totalElements;
    this.dataSource = new MatTableDataSource(data);
    this.tablePageIndex = meta?.page - 1;
    this.cdr.markForCheck();
  }

  handlePageEvent(event: any) {
    this.pagesize = event?.value?.pageSize | event.pageSize;
    this.pageIndex = event?.value?.page | event?.page;
    this.fetchResultArray();
  }

  populateItem(item) {
    this.dialogRef.close(item);
  }
}
