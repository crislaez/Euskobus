import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { AuthActions, AuthService } from '@any/web-modules/auth';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private store: Store
    // private auth: AuthService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // req = this._addAuthenticationToken(req);
    // return next.handle(req)

    return next.handle(request).pipe(//req
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        console.log('[error] => ',error)

        // if (err.status === 401 && !this._isExcludedPage(req)) {
        //   return this._auth.refresh().pipe(
        //     catchError((err) => {
        //       console.error(err);
        //       // this.store.dispatch(AuthActions.forceLogout());
        //       return EMPTY;
        //     }),
        //     switchMap(() => next.handle(request)),
        //   );
        // }

        //   if(error.status === 403){
        //     // this.store.dispatch(AuthActions.forceLogout());
        //     //return EMPTY
        //   }
        // return throwError(() => error?.error || error);
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  // private _addAuthenticationToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
  //   if (!this.auth.token || this._isExcludedPage(request)) {
  //     return request;
  //   }

  //   return request.clone({
  //     headers: request.headers.set('Authorization', `Bearer ${this.auth.token}`)
  //   });
  // }

  // private isExcludedPage(request: HttpRequest<unknown>): boolean {
  //   return request.url.startsWith('assets/') || request.url.includes('/login') || request.url.includes('/refresh');
  // }
}

// intercept(
//   request: HttpRequest<any>,
//   next: HttpHandler
// ): Observable<HttpEvent<any>> {
//   const accessToken = Cookies.get(
//     environment.gvlogin.cookieKey + '.' + environment.gvlogin.aplicacion
//   );
//   if (accessToken) {
//     request = request.clone({
//       setHeaders: {
//         Authorization: accessToken
//       }
//     });
//   }
//   return next.handle(request);
// }
