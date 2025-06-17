import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { countryStateService } from './countrySateCityService';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-reusable-pincode-popup',
  templateUrl: './reusable-pincode-popup.component.html',
  styleUrls: ['./reusable-pincode-popup.component.scss'],
})
export class ReusablePincodePopupComponent implements OnInit {
  public pincodeForm!: FormGroup;
  countries: any[] | any;
  states: any[] | any;
  cities: any[] | any;
  pincodeExpansion: any[] = [];
  dataSource: any;
  emptyData = new MatTableDataSource([{ empty: 'empty-row' }]);
  columns: any = [
    {
      columnDef: 'pinCode',
      header: 'Pin Code',
      cell: (element: any) => `${element.pincode}`,
    },
    {
      columnDef: 'countryName',
      header: 'Country',
      cell: (element: any) => `${element.countryName}`,
    },
    {
      columnDef: 'stateName',
      header: 'State',
      cell: (element: any) => `${element.stateName}`,
    },
    {
      columnDef: 'cityName',
      header: 'City',
      cell: (element: any) => `${element.cityName}`,
    },
  ];
  displayedColumns: any;
  totalLength: any;
  tablePageIndex: number | any;
  pagesize: number | any;
  pageIndex: number | any;
  filterValue: any;

  constructor(
    public dialogRef: MatDialogRef<ReusablePincodePopupComponent>,
    private fb: FormBuilder,
    private countryStateCityService: countryStateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((c: any) => c.columnDef);
    this.fetchAllCountry();
    this.fetchAllState();
    this.fetchAllCity();
    setTimeout(() => {
      this.buildForm();
    }, 2000);
  }

  close() {
    this.dialogRef.close();
  }

  buildForm() {
    this.pincodeForm = this.fb.group({
      countryId: [''],
      pincode: [''],
      stateId: [''],
      cityId: [''],
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

  fetchStateByCountry(countryId: any) {
    this.states = [];
    this.cities = [];
    if (countryId)
      this.countryStateCityService
        .getStateByCountry(countryId)
        .subscribe((res) => {
          if (res?.statusCode === 200 && res?.data) {
            this.states = res?.data;
          }
        });
  }

  fetchCityByState(stateId: any) {
    this.cities = [];
    this.pincodeForm
      .get('countryId')
      ?.setValue(
        this.states.find((s: any) => s?.stateId === stateId)?.countryId,
      );
    if (stateId)
      this.countryStateCityService.getCityByState(stateId).subscribe((res) => {
        if (res?.statusCode === 200 && res?.data) {
          this.cities = res?.data;
        }
      });
  }

  populateStateCountryByCity(cityId: any) {
    const city = this.cities.find((s: any) => s?.cityId === cityId);
    this.pincodeForm.get('countryId')?.setValue(city?.countryId);
    this.pincodeForm.get('stateId')?.setValue(city?.stateId);
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

  updateTable(data: any, meta: any) {
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

  populateItem(item: any) {
    this.dialogRef.close(item);
  }
}
