import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vaga, CreateVagaDto, UpdateVagaDto } from '../models/vaga.model';

@Injectable({ providedIn: 'root' })
export class VagaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vaga`;

  findAll(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(this.apiUrl);
  }

  findDisponiveis(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(`${this.apiUrl}/disponiveis`);
  }

  findOne(id: number): Observable<Vaga> {
    return this.http.get<Vaga>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateVagaDto): Observable<Vaga> {
    return this.http.post<Vaga>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateVagaDto): Observable<Vaga> {
    return this.http.patch<Vaga>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}