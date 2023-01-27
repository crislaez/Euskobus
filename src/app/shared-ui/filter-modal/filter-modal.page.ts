import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
// import { Source } from '@euskobus/shared/source';
import { isNotEmptyObject } from '@euskobus/shared/utils/funcionts';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  template: `
  <ion-content class="modal-wrapper">

    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons class="text-color-dark" slot="end">
          <ion-button class="ion-button-close" fill="clear"
            (click)="dismissModal()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <div class="displays-around height-100">

      <!-- <ng-container *ngIf="(sourceFilter?.length || [])> 0" >
        <ion-item class="item-select font-medium ">
          <ion-label>{{ 'FILTERS.BY_SOURCE' | translate }}</ion-label>
          <ion-select (ionChange)="changeFilter($any($event), 'sourceId')" [value]="sourceIdSelected || ''" interface="action-sheet">
            <ion-select-option [value]="''">{{ 'COMMON.ALL' | translate }}</ion-select-option>
            <ion-select-option *ngFor="let source of sourceFilter" [value]="source?.id">{{ source?.descripcionEs }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ng-container> -->

    </div>

</ion-content>
  `,
  styleUrls: ['./filter-modal.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterModalComponent {

  isNotEmptyObject = isNotEmptyObject;
  // @Input() sourceIdSelected: any
  // @Input() sourceFilter!: Source[];


  constructor(
    public modalController: ModalController
  ) { }


  changeFilter(event: any, filter: string): void {
    const { detail = null } = event || {};
    const { value = null } = detail || {};

    this.modalController.dismiss({
      [filter]:value
    });
  }

  dismissModal() {
    this.modalController.dismiss(false);
  }



}
