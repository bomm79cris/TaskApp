import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, concatMap, finalize, Observable, of, retryWhen, throwError } from 'rxjs';
import { LoginService } from '../shared/services/login.service';
import { CodigoError } from '../enums/codigo-error.enum';
import { LoadingService } from '../shared/services/loading.service';
import { MessageService } from '../shared/services/message.service';


@Injectable(
  {
    providedIn: 'root'
  }
)
export class ErrorInterceptor implements HttpInterceptor {

  petionesActivas:number;

  constructor(private serviceLoader: LoadingService, private messageService:MessageService, private securityService: LoginService) {
    this.petionesActivas = 0;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.petionesActivas++;
    if(this.hasSkipLoader(request)){
      request = this.deleteSkipLoaderHeader(request);
    }else{
      this.serviceLoader.showLoading();
    }
    return next.handle(request)
    .pipe(
      retryWhen(error => this.retryHandler(error, 3)),
      catchError(error =>  this.handleError(error)),
      finalize(
        () => {
          this.petionesActivas--;
          if(this.petionesActivas === 0){
            this.serviceLoader.hideLoading();
          }
        }
      )
    );
  }

  private deleteSkipLoaderHeader(request: HttpRequest<unknown>):HttpRequest<unknown>{
    return request.clone({
      headers: request.headers.delete('skipLoader')
    });
  }

  private hasSkipLoader(request: HttpRequest<unknown>):boolean{
    return request.headers.has('skipLoader');
  }

  /**
   * Reintento de realizar una petición en caso de error
   * @param error Error de al realizar petición
   * @param totalReintentos Número total de reintentos
   * @returns Observable
   */
  private retryHandler(error: Observable<any>, totalReintentos:number):Observable<any>{
    return error.pipe(
      concatMap((errorCheck: HttpErrorResponse, conteoReintentos:number) => {
        if(errorCheck.status === CodigoError.servidorCaido && conteoReintentos < totalReintentos){
          return of(errorCheck);
        }
        return throwError(
          () => errorCheck
        );
      })
    )
  }

  /**
   *
   * @param error Error de al realizar petición
   * @returns
   */
  private handleError(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    let mensajeError:string = "Ha ocurrido un error desconocido.";
    if (error.status === CodigoError.servidorCaido) {
      mensajeError ="No ha sido posible establecer conexión con el servidor de la aplicación.";
    } else {
      mensajeError = this.manejarErrorPeticionONoPermitido(error);
    }
    this.messageService.addMessage({summary:mensajeError, severity: "error"});
    return throwError(() =>  {return { message: mensajeError, status: error.status || 500, body: error.error || null, headers: error.headers || null }}
      );
  }

  private manejarErrorPeticionONoPermitido(error: HttpErrorResponse):string{
    if(error.status === CodigoError.errorPeticion || error.status === CodigoError.errorNoPermitido){
      return error.error.message;
    }else{
      return this.manejarErrorNoAutorizado(error);
    }
  }

  private manejarErrorNoAutorizado(error: HttpErrorResponse):string{
    if(error.status === CodigoError.noAutorizado){
      this.securityService.logout();
      return "Se detectó un intento de acceso sin credenciales autorizadas.";
    }else{
      return `El servidor retorna un error en la petición, ${error.status} ${error.statusText}, inténtelo más tarde.`;
    }
  }
}
