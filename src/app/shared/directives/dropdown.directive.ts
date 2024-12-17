import { Directive } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownLinkDirective } from './dropdown-link.directive';

@Directive({
  selector: '[appDropdown]',
})
export class AppDropdownDirective {
  protected navlinks: Array<DropdownLinkDirective> = [];

  public closeOtherLinks(openLink: DropdownLinkDirective): void {
    this.navlinks.forEach((link: DropdownLinkDirective) => {
      if (link !== openLink) {
        link.open = false;
      }
    });
  }

  public addLink(link: DropdownLinkDirective): void {
    this.navlinks.push(link);
  }

  public removeGroup(link: DropdownLinkDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }

  public getUrl() {
    return this.router.url;
  }

  constructor(private router: Router) {}
}
