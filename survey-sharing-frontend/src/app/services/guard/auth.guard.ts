import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../token.service';
import { GlobalService } from '../global.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const globalService = inject(GlobalService);
  if(tokenService.isTokenNotValid()){
    globalService.navigate('login',null);
    return false;
  }
  return true;
}
