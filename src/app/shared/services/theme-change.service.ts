import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ThemeChangeService {
  themeColors: Partial<ThemeOption>[] = [
    {
      theme: 'theme1',
      color: '#fff',
      background: '#00205c',
      backgroundLight: '#EAF1FF',
      backgroundDark: '#001131',
      borderColor: '#377DFF4E',
      filter: 'hue-rotate(0deg)',
    },
    {
      theme: 'theme2',
      color: '#fff',
      background: '#E6224A',
      backgroundLight: '#FFEFEE',
      backgroundDark: '#A80F2E',
      borderColor: '#E6224A5E',
      filter: 'hue-rotate(120deg) saturate(1.2) contrast(1.5)',
    },
    {
      theme: 'theme3',
      color: '#fff',
      background: '#6922BE',
      backgroundLight: '#F8E2FF',
      backgroundDark: '#3E0B7D',
      borderColor: '#590372',
      filter: 'hue-rotate(28deg) saturate(2) contrast(1)',
    },
    {
      theme: 'theme4',
      color: '#fff',
      background: '#00D495',
      backgroundLight: '#E3FFFA',
      backgroundDark: '#00D495',
      borderColor: '#00C1B7',
      filter: 'hue-rotate(303deg) brightness(2.6) saturate(1.5) contrast(0.5)',
    },
    {
      theme: 'theme5',
      color: '#fff',
      background: '#00A0A7',
      backgroundLight: '#D9F6F6',
      backgroundDark: '#007C81',
      borderColor: '#007C81',
      filter: 'hue-rotate(330deg) saturate(2.5) sepia(0.3)',
    },
  ];

  // This BehaviorSubject holds the data of currently selected theme
  private currentThemeSubject = new BehaviorSubject<ThemeOption | null>(null);

  // This exposed observable is for getting current theme data across the application
  getCurrentTheme$ = this.currentThemeSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
  ) {}

  // This method is to set/update the current theme
  setCurrentTheme(data: ThemeOption) {
    this.setSelectedTheme({
      color: data.color,
      background: data.background,
      filter: data.filter,
      backgroundLight: data.backgroundLight,
      backgroundDark: data.backgroundDark,
      borderColor: data.borderColor,
    });

    this.currentThemeSubject.next(data);
  }

  setSelectedTheme(payload: {
    color: string;
    background: string;
    filter: string;
    backgroundLight: string;
    backgroundDark: string;
    borderColor: string;
  }) {
    payload.color &&
      this.document.documentElement.style.setProperty(
        '--current-theme-color',
        payload.color,
      );

    payload.background &&
      this.document.documentElement.style.setProperty(
        '--current-theme-background',
        payload.background,
      );

    payload.filter &&
      this.document.documentElement.style.setProperty(
        '--current-theme-filter',
        payload.filter,
      );

    payload.backgroundLight &&
      this.document.documentElement.style.setProperty(
        '--current-theme-background-light',
        payload.backgroundLight,
      );

    payload.backgroundDark &&
      this.document.documentElement.style.setProperty(
        '--current-theme-background-dark',
        payload.backgroundDark,
      );

    payload.borderColor &&
      this.document.documentElement.style.setProperty(
        '--current-theme-border-color',
        payload.borderColor,
      );
  }
  saveCurrentTheme(payload: {
    userId: number;
    themeInfoId?: number;
    language: string;
    color: string | undefined;
    id?: number;
  }) {
    return this.http.post(
      `${environment.microServiceURL}/screen/saveUserThemeLang`,
      payload,
    );
  }

  fetchCurrentTheme(userId: number) {
    console.log(userId);
    return this.http.get(
      `${environment.microServiceURL}/screen/fetchUserThemeLang?userId=${userId}`,
    );
  }
}

export interface ThemeOption {
  theme: string;
  color: string;
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  borderColor: string;
  filter: string;
}
