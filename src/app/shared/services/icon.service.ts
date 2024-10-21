import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class IconService {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) { }

    /**
     * this method will check whether mat icon is added in mat icon registry
     * if not added then it will add it to mat icon registry
     * @param iconName name of the icon to be checked
     * @param url path of the source svg to be added in mat icon registry
     * @returns boolean value, if it is present it will return false or else it will
     * add the icon to registry and will return true
     */
    addIconIfNotExists(iconName: string, url: string): Observable<boolean> {
        return this.checkIconExists(iconName).pipe(
            switchMap((exists) => {
                if (exists) {
                    return of(true); // Icon already exists
                } else {
                    this.matIconRegistry.addSvgIcon(
                        iconName,
                        this.sanitizer.bypassSecurityTrustResourceUrl(url)
                    );
                    return of(false); // Icon was added
                }
            })
        );
    }

    /**
     * this method will return whether icon is added in mat-icon-registry or not
     * @param iconName name of icon
     * @returns boolean observable whether it is present or not
     */
    private checkIconExists(iconName: string): Observable<boolean> {
        return this.matIconRegistry.getNamedSvgIcon(iconName).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
