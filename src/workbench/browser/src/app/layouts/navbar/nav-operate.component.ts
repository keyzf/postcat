import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService } from '../../core/services';

@Component({
  selector: 'eo-nav-operate',
  template: ` <div class="flex items-center" *ngIf="isElectron">
    <nz-divider nzType="vertical"></nz-divider>
    <button eo-ng-button (click)="refresh()" nzType="default">
      <eo-iconpark-icon eoNgFeedbackTooltip i18n-nzTooltipTitle nzTooltipTitle="Refresh" nzType="" name="refresh"></eo-iconpark-icon>
    </button>
    <div *ngIf="!isMac">
      <button
        eo-ng-button
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        nzTooltipTitle="Minimize"
        [nzTooltipMouseEnterDelay]="0.4"
        nzType="text"
        (click)="minimize()"
      >
        <eo-iconpark-icon name="minus"></eo-iconpark-icon>
      </button>
      <button
        eo-ng-button
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        nzTooltipTitle="Minimize"
        [nzTooltipMouseEnterDelay]="0.4"
        nzType="text"
        (click)="toggleMaximize()"
      >
        <eo-iconpark-icon [name]="isMaximized ? 'off-screen' : 'full-screen'"></eo-iconpark-icon>
      </button>
      <button
        eo-ng-button
        eoNgFeedbackTooltip
        i18n-nzTooltipTitle
        (click)="close()"
        [nzTooltipMouseEnterDelay]="0.4"
        nzTooltipTitle="Quit"
        nzType="text"
      >
        <eo-iconpark-icon name="close"></eo-iconpark-icon>
      </button>
    </div>
  </div>`
})
export class NavOperateComponent {
  isMaximized = false;
  isElectron = this.electron.isElectron;
  isMac = navigator.platform.toLowerCase().includes('mac');
  constructor(private electron: ElectronService, private router: Router) {}
  minimize() {
    this.electron.ipcRenderer.send('message', {
      action: 'minimize'
    });
  }
  async refresh() {
    const { pathname, hash, searchParams } = new URL(window.location.protocol + window.location.host + this.router.url);
    await this.router.navigate(['**']);
    await this.router.navigate([pathname], { queryParams: Object.fromEntries(searchParams.entries()) });
  }
  toggleMaximize() {
    this.electron.ipcRenderer.send('message', {
      action: this.isMaximized ? 'restore' : 'maximize'
    });
    this.isMaximized = !this.isMaximized;
  }
  close() {
    this.electron.ipcRenderer.send('message', {
      action: 'close'
    });
  }
}