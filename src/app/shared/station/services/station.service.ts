import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@euskobus/core/services/core-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as converter from 'xml-js';
import { Station } from '../models/station.models';


@Injectable({
  providedIn: 'root',
})
export class StationService {

  baseURL: string = this._coreConfig.baseEndpoint;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getStations(): Observable<{stations: Station[]}> {
    return this.http.get<any>(`${this.baseURL}GetParadas`,{ responseType: 'text/xml' as 'json'  } ).pipe(
      map((response): any => {
        const xmlToJson = converter.xml2json((response as any), {compact: true, spaces: 2});
        const JSONData = JSON.parse(xmlToJson);
        const stations = JSONData?.['GELTOKIAK-PARADAS']?.['GELTOKIA-PARADA'] || [];
        return { stations: stations || [] };
      }),
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }


}
// http://apps.bizkaia.eus/BBOA000M/rest/BBOA/GetLineasHorarios
// http://apps.bizkaia.eus/BBOA000M/rest/BBOA/GetAllVehiculos
