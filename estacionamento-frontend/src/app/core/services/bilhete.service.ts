import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Bilhete,
  CreateBilheteDto,
  FinalizarBilheteDto,
} from '../models/bilhete.model';

@Injectable({ providedIn: 'root' })
export class BilheteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bilhete`;

  findAll(): Observable<Bilhete[]> {
    return this.http.get<Bilhete[]>(this.apiUrl);
  }

  findAbertos(): Observable<Bilhete[]> {
    return this.http.get<Bilhete[]>(`${this.apiUrl}/abertos`);
  }

  findFinalizados(): Observable<Bilhete[]> {
    return this.http.get<Bilhete[]>(`${this.apiUrl}/finalizados`);
  }

  findOne(id: number): Observable<Bilhete> {
    return this.http.get<Bilhete>(`${this.apiUrl}/${id}`);
  }

  checkIn(dto: CreateBilheteDto): Observable<Bilhete> {
    return this.http.post<Bilhete>(this.apiUrl, dto);
  }

  trocarVaga(id: number, vagaId: number): Observable<Bilhete> {
    return this.http.patch<Bilhete>(`${this.apiUrl}/${id}`, {
      Vaga_id_vaga: vagaId,
    });
  }

  checkOut(id: number, dto: FinalizarBilheteDto = {}): Observable<Bilhete> {
    return this.http.patch<Bilhete>(`${this.apiUrl}/${id}/finalizar`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}