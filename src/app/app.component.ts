import { Component, OnDestroy, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { EventBusService } from './_shared/event-bus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private eventBusService: EventBusService,
    private router :Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('admin') || true;
      this.showModeratorBoard = this.roles.includes('user') || true;

      this.username = user.username;
      this.eventBusService.emit('login');

    }
    this.cdr.detectChanges(); 
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.storageService.clean();
    window.location.reload();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.eventBusSub) {
      this.eventBusSub.unsubscribe();
    }
  }
}
