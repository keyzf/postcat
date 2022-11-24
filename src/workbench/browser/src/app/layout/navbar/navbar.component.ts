import { Component, OnInit } from '@angular/core';
import { ElectronService, WebService } from '../../core/services';
import { ModuleInfo } from 'eo/platform/node/extension-manager/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SettingComponent } from '../../modules/setting/setting.component';
import { MessageService } from 'eo/workbench/browser/src/app/shared/services/message';
import { UserService } from 'eo/workbench/browser/src/app/services/user/user.service';
import { DataSourceService } from 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service';
import { StatusService } from 'eo/workbench/browser/src/app/shared/services/status.service';
import { distinct } from 'rxjs/operators';
import { interval } from 'rxjs';
import { WorkspaceService } from '../../pages/workspace/workspace.service';
import { LanguageService } from '../../core/services/language/language.service';
@Component({
  selector: 'eo-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  resourceInfo = this.web.resourceInfo;

  helpMenus = [
    {
      title: 'Document',
      href: 'https://docs.eoapi.io',
      click: ($event) => {},
    },
    {
      title: 'Report Issue',
      href: `https://github.com/eolinker/eoapi/issues/new?assignees=&labels=&template=bug_report.yml&environment=${this.getEnvironment()}`,
      click: ($event) => {},
    },
  ];
  constructor(
    public electron: ElectronService,
    private web: WebService,
    private modal: NzModalService,
    private message: MessageService,
    public lang: LanguageService,
    public userService: UserService,
    public dataSourceService: DataSourceService,
    public status: StatusService,
    public workspaceService: WorkspaceService
  ) {}

  async ngOnInit(): Promise<void> {
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(async ({ type }) => {
        if (type === 'open-setting') {
          this.openSettingModal();
          return;
        }
      });
  }

  loginOrSign() {
    this.dataSourceService.checkRemoteCanOperate();
  }
  loginOut() {
    this.message.send({ type: 'logOut', data: {} });
  }

  handleSwitchLang(event) {
    this.lang.changeLanguage(event);
  }

  /**
   * 打开系统设置
   */
  openSettingModal() {
    const ref = this.modal.create({
      nzClassName: 'eo-setting-modal',
      nzContent: SettingComponent,
      nzFooter: null,
    });
    this.message
      .get()
      .pipe(distinct(({ type }) => type, interval(400)))
      .subscribe(({ type }) => {
        if (type === 'close-setting') {
          ref.close();
        }
      });
  }
  private getEnvironment(): string {
    let result = '';
    const systemInfo = this.electron.getSystemInfo();
    systemInfo.forEach((val) => {
      if (['homeDir'].includes(val.id)) {
        return;
      }
      result += `- ${val.label}: ${val.value}\r\n`;
    });
    return encodeURIComponent(result);
  }
}
