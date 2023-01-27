import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@euskobus/core/services/core-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as converter from 'xml-js';
import { Geolocation } from '../models/geolocation.models';


@Injectable({
  providedIn: 'root',
})
export class GeolocationService {

  baseURL: string = this._coreConfig.baseEndpoint;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getGeolocations(): Observable<{geolocations: Geolocation[]}> {
    return this.http.get<any>(`${this.baseURL}GetAllVehiculos`,{ responseType: 'text/xml' as 'json'  } ).pipe(
      map((response): any => {
        const xmlToJson = converter.xml2json((response as any), {compact: true, spaces: 2});
        const JSONData = JSON.parse(xmlToJson);
        const lines: any [] = JSONData?.['LINEAK-LINEAS']?.['LINEA-LINEA'] || [];
        return {
          geolocations: (lines || [])?.reduce((acc, element) => {
            const item = (element as any)?.['IBILGAILUAK-VEHICULOS']?.['IBILGAILUA-VEHICULO'] || null;
            const vehicles = Array.isArray(item) ? item : [...(item ? [item] : [])]
            return [
              ...acc,
              ...(vehicles ? vehicles : [])
            ];
          },[])
        };
      }),
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }


}


