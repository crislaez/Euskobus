import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Station } from '@euskobus/shared/station';
import { COLORS } from '@euskobus/shared/utils/constant';
import { APP_ENTITIES } from '@euskobus/shared/utils/enum';
import { errorImage, sliceText } from '@euskobus/shared/utils/funcionts';

@Component({
  selector: 'app-card',
  template:`
  <ion-card
    class="ion-activatable ripple-parent set-card"
    [ngStyle]="{'background':backgroundColor}"
    (click)="onClick()"
    >

    <div class="set-item displays-around" >
      <div class="set-item-title displays-center" >
        <div class="span-text text-color-light displays-around-center">
          <div>
            <ion-icon *ngIf="from === 'Station'" name="business-outline"></ion-icon>
            <ion-icon *ngIf="from === 'Schedule'" name="calendar-number-outline"></ion-icon>
          </div>
          <div>
            <span *ngIf="['Line', 'Station', 'Schedule']?.includes(from)" class="span-bold">{{ sliceText($any(item)?.['DESKRIPZIOA-DESCRIPCION']?.['_text'],30) || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIPLE EFFECT  -->
    <ion-ripple-effect></ion-ripple-effect>
  </ion-card>
  `,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  sliceText = sliceText;
  errorImage = errorImage;
  COLORS = COLORS;
  @Input() from!: APP_ENTITIES;
  @Input() item!: Station;
  @Input() backgroundColor!: string;
  defaultImage: string = 'assets/images/image_not_found.png';
  itemTitleEntities = ['Station', 'TaxiStand', 'Parking', 'StationService', 'BikeStation', 'CultureEvent'];


  constructor(
    private router: Router,
  ) { }


  onClick(): void {
    // if(this.from === 'Line') return;

    const url:string = {
      // 'Line': `map/line/${this.item}`,
      'Station': `map/station/${this.item?.['KODEA-CODIGO']?.['_text']}`,
      'Schedule': `map/schedule/${this.item?.['KODEA-CODIGO']?.['_text']}`,
    }?.[this.from] || '/home';

    this.router.navigate([url])
  }


}

