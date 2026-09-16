import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Veiculo,
  CreateVeiculoDto,
  UpdateVeiculoDto,
} from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/veiculo`;

  findAll(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateVeiculoDto): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateVeiculoDto): Observable<Veiculo> {
    return this.http.patch<Veiculo>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}