import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Aqui você pode adicionar headers globais (ex: Authorization)
  const cloned = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });
  return next(cloned);
};