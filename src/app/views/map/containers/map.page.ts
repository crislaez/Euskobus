import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeolocationService } from '@euskobus/shared/geolocation/services/geolocation.service';
import { fromStation } from '@euskobus/shared/station';
import { EntityStatus } from '@euskobus/shared/utils/enum';
import { gotToTop, trackById } from '@euskobus/shared/utils/funcionts';
import { Store } from '@ngrx/store';
import { Map, icon, marker, tileLayer, utm } from 'leaflet';
import 'leaflet.utm';
import { EMPTY, Observable, Subject, interval, takeUntil, tap } from 'rxjs';
import { catchError, concatMap, filter, finalize, first, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  template:`
  <ion-content [fullscreen]="true" [scrollEvents]="true">

    <div class="empty-header components-background-dark">
    </div>

    <!-- LOADER STATION -->
    <ng-container *ngIf="path === 'station'">
      <ng-container *ngIf="status$ | async as status">
        <ng-container *ngIf="status === 'pending'">
          <ng-container *ngTemplateOutlet="spinner">
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-container>

    <!-- LOADER GEOLOCATION -->
    <ng-container *ngIf="path === 'geolocation'">
      <ng-container *ngIf="geolocationStatus === 'pending'">
        <ng-container *ngTemplateOutlet="spinner">
        </ng-container>
      </ng-container>
    </ng-container>

    <div class="container components-background-dark">
      <h1 class="text-color-gradient">
        <!-- {{ 'COMMON.MAP' | translate }} -->
        {{ (
            getOption === 'station' ? 'COMMON.STATIONS'
          : getOption === 'geolocation' ? 'COMMON.GEOLOCATION'
          : ''
        ) | translate }}
      </h1>
      <div class="empty-div"></div>

      <div class="map-wrapper">
        <div
          leaflet
          id="map">
        </div>
      </div>

      <div class="notification-wrapper">
        <p>{{ 'COMMON.NOTIFICATION_MESSAGE' | translate }}</p>
      </div>
    </div>

    <ng-template #spinner>
      <app-spinner [top]="'85%'">
      </app-spinner>
    </ng-template>

  </ion-content>
  `,
  styleUrls: ['./map.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPage implements OnDestroy {

  gotToTop = gotToTop;
  trackById = trackById;

  private ngUnsubscribe$ = new Subject<void>();
  markerIcon: string = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
  busIcon: string = 'assets/icon/busIcon.png';
  shadowIcon: string = 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png';
  map: any;
  baseLat: number = 43.3017;
  baseLong: number = -3.0110;
  path!: 'geolocation' | 'station';
  status$ = this.route.data.pipe(
    switchMap((data) => {
      const { path = null } = data || {};
      if(!path) return EMPTY;
      return this.getStatus(path)
    })
  );
  allMarkers: any[] = [];
  geolocationStatus!: EntityStatus;


  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private _geolocation: GeolocationService
  ) {
    this.path = this.route.snapshot.data?.['path']
    this.route.params.pipe(
      takeUntil(this.ngUnsubscribe$),
      filter(({ stationId = null }) => (stationId )),
      switchMap(({stationId = null}) =>
        this.getStoreState().pipe(
          first((storeState) => ['loaded','error'].includes(storeState?.status)),
          switchMap(data => {
            if(!stationId) return EMPTY;

            return this.getStoreItem(stationId).pipe(
              tap((selected) => {
                if(!selected) return;

                setTimeout(() => {
                  if(['station']?.includes(this.getOption)){
                    const { latitude, longitude } = this.getCoords((selected as any)) || {};
                    if(!latitude || !longitude) return;
                    this.addMarker((latitude as number), (longitude as number), selected); //AGREGA PUNTOS
                    return;
                  }

                  // if(this.getOption === 'line'){
                  //   const { result = [] } = (item as Line) || {};
                  //   const [ lineString = null, ...restCoordinates ] = result || [];
                  //   const { geometry = null } = lineString || {};
                  //   const { coordinates = [] } = geometry || {};
                  //   const [ firstCoordinates = [] ] = coordinates || []

                  //   this.addLine( this.parseCoordinates( (firstCoordinates as any) ) ); //AGREGA LINEA

                  //   (restCoordinates || [])?.forEach(item => {
                  //     const { latitude, longitude } = this.getCoords((item as Station));
                  //     if(!latitude || !longitude) return;
                  //     this.addMarker((latitude as number), (longitude as number), item); //AGREGA PUNTOS
                  //   });
                  //   return;
                  // }

                },1000)
              })
            )
          })
        )
      )
    ).subscribe();

    if(this.path !== 'geolocation') return;

    this.geolocationStatus = EntityStatus.Pending;
    interval(10000).pipe(
      takeUntil(this.ngUnsubscribe$),
      startWith({}),
      concatMap(() =>
        this._geolocation.getGeolocations().pipe(
          takeUntil(this.ngUnsubscribe$),
          tap(({geolocations}) => {
            // BORRAR TODOS LOS PUNTOS
            (this.allMarkers || [])?.forEach(layer => this.map.removeLayer(layer))

            setTimeout(() => {
              (geolocations || [])?.forEach((item) => {
                const { latitude = 0, longitude = 0 } = this.getCoords((item as any)) || {};
                if(!latitude || !longitude) return;
                this.addMarker((latitude as number), (longitude as number), item); //AGREGA PUNTOS
              })
            },500);
          }),
          catchError(() => EMPTY),
          finalize(() => {
            this.geolocationStatus = EntityStatus.Loaded;
            this.cdRef.detectChanges();
          })
        )
      )
    ).subscribe();
  }


  ionViewDidEnter(): void{
    this.map = new Map('map').setView([this.baseLat,this.baseLong], 13); // por defecto cerca de Bilbao 43.2312,-2.9416
    // tileLayer -> AGREGAR UNA CAPA
    tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      // attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map)
  }

  ngOnDestroy(): void{
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  // GET PARAMS OPTION
  get getOption(): 'station' | 'geolocation' {
    return this.route.snapshot.routeConfig?.path?.includes('station') ? 'station'
         : this.path === 'geolocation' ? 'geolocation'
         : 'station';
  }

  // ADD ICON
  get setIcon(): any{
    const icon = this.getOption === 'geolocation' ? this.busIcon :  this.markerIcon;
    return {
      iconSize: [
        25,
       ...( this.getOption !== 'geolocation' ? [ 45 ] : [ 25 ])
      ],
      iconAnchor: [ 13, 41 ],
      iconUrl: icon,
      // shadowUrl: this.shadowIcon,
    }
  }

  getStoreState(): Observable<any>{
    return {
      'station': this.store.select(fromStation.selectMultiState),
      'geolocation': EMPTY
    }?.[this.getOption] || this.store.select(fromStation.selectMultiState)
  }

  getStoreItem(id: string): Observable<any> {
    return {
      'station': this.store.select(fromStation.selectStation(id)),
      'geolocation': EMPTY
    }?.[this.getOption] || this.store.select(fromStation.selectStation(id))
  }

  getStatus(type: 'station'): Observable<any>{
    return {
      'station': this.store.select(fromStation.selectStatus)
    }?.[type] || this.store.select(fromStation.selectStatus)
  }

  getCoords(item: any): {longitude: number | number[], latitude: number | number[]} {
    const { X = '0', Y = '0' } = item?.['GEOLOKALIZAZIOA-GEOLOCALIZACION'] || {};

    const x = Number(X?.['_text']?.replace(/,/g,'.'));
    const y = Number(Y?.['_text']?.replace(/,/g,'.'));

    const data = utm({
      x: isNaN(x) ? 0 : x,
      y: isNaN(y) ? 0 : y,
      zone: 30,
      band: 'N',
      southHemi: false
    });

    return {
      longitude: data?.latLng()?.lng ?? 0,
      latitude: data?.latLng()?.lat ?? 0,
    };
  }

  // ADD MARKER
  addMarker(lat:number, long:number, data:any): void{
    const popUp = {
      'station': this.stationPopUp(data),
      'geolocation': this.vehiclePopUp(data),
    }?.[this.getOption] || this.stationPopUp(data) || 'Loading...';

    //MARACADOR y ABRIR POPUP
    const marketItem = marker(
      [lat, long],{
        icon: icon(this.setIcon)
    }).addTo(this.map).bindPopup(popUp)

    // GAURDAMOS TODOS LOS MARKERS
    this.allMarkers = [
      ...this.allMarkers,
      marketItem
    ];

    // EN STATION NO QUIERO QUE HAGA ZOOM
    if(this.getOption === 'geolocation') return;

    //ZOOM y acercarse a ese marcador
    this.map.fitBounds([ [marketItem.getLatLng().lat, marketItem.getLatLng().lng] ]);
  }

  // ADD LINE
  // addLine(coordinates: any): void{ //LatLngExpression[][]
  //   if(!coordinates) return;
  //   polyline(coordinates).addTo(this.map)
  // }

  // PARSE COORDINATES
  // parseCoordinates(coordinates: any[][] | null): number[][] {
  //   if(!coordinates) return [];
  //   return (coordinates || [])?.map(element => {
  //     const [long = null, lat = null] = element || []
  //     return [lat, long];
  //   });
  // }

  // CREATE STATION POPUP
  stationPopUp(station: any): string {
    const { latitude, longitude } = this.getCoords((station as any)) || {};
    return `
      <b>Descripción:</b> ${station?.['DESKRIPZIOA-DESCRIPCION']?.['_text'] || '-' }<br/><br/>
      <b>Caretera:</b> ${station?.['ERREPIDEA-CARRETERA']?.['_text'] || '-'}<br/>
      <b>Tiempo:</b> ${station?.['KALIFIKAZIO_CAS-CALIFICACION_CAS']?.['_text'] || '-'}<br/>
      <b>Provincia:</b> ${station?.['PROBINTZIA-PROVINCIA']?.['_text'] || '-'}<br/>
      <b>Municipio:</b> ${station?.['UDALERRIA-MUNICIPIO']?.['_text'] || '-'}<br/>
      <strong>Lat/Long:</strong> ${station?.['GEOLOKALIZAZIOA-GEOLOCALIZACION']?.['X']?.['_text'] || '-'}, ${station?.['GEOLOKALIZAZIOA-GEOLOCALIZACION']?.['Y']?.['_text'] || '-'}
      <br /><br />
      <div class="text-right">
        ${this.setMapButton(latitude?.toString(), longitude?.toString())}
      </div>
    `;
  }

  // CREATE STATION POPUP
  vehiclePopUp(vehicle: any): string {
    const { latitude, longitude } = this.getCoords((vehicle as any)) || {};
    return `
      <b>Vehiculo:</b> ${vehicle?.['IBILGAILU_ZENBAKIA-NUMERO_VEHICULO']?.['_text'] || '-' }<br/><br/>
      <strong>Lat/Long:</strong> ${latitude || '-'}, ${longitude|| '-'}
      <br /><br />
      <div class="text-right">
        ${this.setMapButton(latitude?.toString(), longitude?.toString())}
      </div>
    `;
  }

  // CREATE ANHOR STREETVIEW
  setMapButton(lat: string, lng: string): string {
    return `
      <a href="https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}" target="_blank" title="Street view">
        <i class="pi pi-map-marker"></i>
        Ver en Street View
      </a>
    `;
  }

}
