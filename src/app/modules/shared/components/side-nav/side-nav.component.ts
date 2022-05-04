import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() isAuthenticated: boolean | undefined;
  @Input() isSidenavActive: boolean | undefined;
  @Input() isMenuActive: boolean | undefined;
  @Output() toggleSideNavEvent = new EventEmitter<boolean>();
  page: number = 1;
  isDashboardUrl: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isDashboardUrl = this.router.url.includes('/dashboard');
    if (this.router.url.includes('/read-nft')) {
      this.page = 2;
    }
    if (this.router.url.includes('/list-nft')) {
      this.page = 3;
    }
  }
  toggleSideNav() {
    // if (this.isAuthenticated) {
      this.isSidenavActive = !this,this.isSidenavActive;
      this.toggleSideNavEvent.emit(this.isSidenavActive);
    // }
  }
  navigatePage(index: number) {
    this.page = index;
  }
}
