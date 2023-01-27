import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@euskobus/core/services/core-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as converter from 'xml-js';
import { Schedule } from '../models/schedule.models';


@Injectable({
  providedIn: 'root',
})
export class ScheduleService {

  baseURL: string = this._coreConfig.baseEndpoint;


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getSchedules(): Observable<{schedules: Schedule[]}> {
    return this.http.get<any>(`${this.baseURL}GetLineasHorarios`,{ responseType: 'text/xml' as 'json'  } ).pipe(
      map((response): any => {
        const xmlToJson = converter.xml2json((response as any), {compact: true, spaces: 2});
        const JSONData = JSON.parse(xmlToJson);
        const lines = JSONData?.['LINEAK-LINEAS']?.['LINEA-LINEA']|| [];
        return { schedules: lines || [] };
      }),
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }


}
