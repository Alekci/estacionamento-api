import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ToastService } from '../../shared/components/toast/toast.service';
import { BilheteService } from '../../core/services/bilhete.service';
import { VeiculoService } from '../../core/services/veiculo.service';
import { VagaService } from '../../core/services/vaga.service';
import { Bilhete } from '../../core/models/bilhete.model';
import { Veiculo } from '../../core/models/veiculo.model';
import { Vaga } from '../../core/models/vaga.model';
import { Header } from '../../shared/components/header/header';
import { Modal } from '../../shared/components/modal/modal';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

type Aba = 'abertos' | 'finalizados';

@Component({
  selector: 'app-bilhetes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './bilhetes.html',
})
export class Bilhetes implements OnInit {
  private fb = inject(FormBuilder);
  private bilheteService = inject(BilheteService);
  private veiculoService = inject(VeiculoService);
  private vagaService = inject(VagaService);
  private toast = inject(ToastService);

  aba = signal<Aba>('abertos');
  abertos = signal<Bilhete[]>([]);
  finalizados = signal<Bilhete[]>([]);
  veiculos = signal<Veiculo[]>([]);
  vagasDisponiveis = signal<Vaga[]>([]);

  modalCheckIn = false;
  modalCheckOut = false;
  bilheteSelecionado: Bilhete | null = null;
  confirmAberto = false;
  bilheteParaDeletar: Bilhete | null = null;

  formCheckIn = this.fb.group({
    Veiculo_id_veiculo: [null as number | null, Validators.required],
    Vaga_id_vaga: [null as number | null, Validators.required],
  });

  formCheckOut = this.fb.group({
    valor_bilhete: [null as number | null],
  });

  get bilhetesExibidos(): Bilhete[] {
    return this.aba() === 'abertos' ? this.abertos() : this.finalizados();
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    forkJoin({
      abertos: this.bilheteService.findAbertos(),
      finalizados: this.bilheteService.findFinalizados(),
      veiculos: this.veiculoService.findAll(),
      vagasDisp: this.vagaService.findDisponiveis(),
    }).subscribe({
      next: (r) => {
        this.abertos.set(r.abertos);
        this.finalizados.set(r.finalizados);
        this.veiculos.set(r.veiculos);
        this.vagasDisponiveis.set(r.vagasDisp);
      },
      error: () => this.toast.error('Erro ao carregar bilhetes'),
    });
  }

  abrirCheckIn() {
    this.formCheckIn.reset();
    this.modalCheckIn = true;
  }

  fazerCheckIn() {
    if (this.formCheckIn.invalid) return;
    const dto = this.formCheckIn.value as {
      Veiculo_id_veiculo: number;
      Vaga_id_vaga: number;
    };

    this.bilheteService.checkIn(dto).subscribe({
      next: () => {
        this.toast.success('Check-in realizado!');
        this.modalCheckIn = false;
        this.carregar();
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Erro ao fazer check-in';
        this.toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  }

  abrirCheckOut(bilhete: Bilhete) {
    this.bilheteSelecionado = bilhete;
    this.formCheckOut.reset();
    this.modalCheckOut = true;
  }

  fazerCheckOut() {
    if (!this.bilheteSelecionado) return;
    const dto = this.formCheckOut.value.valor_bilhete
      ? { valor_bilhete: Number(this.formCheckOut.value.valor_bilhete) }
      : {};

    this.bilheteService.checkOut(this.bilheteSelecionado.id_bilhete, dto).subscribe({
      next: (b) => {
        this.toast.success(`Check-out realizado! Valor: R$ ${b.valor_bilhete}`);
        this.modalCheckOut = false;
        this.bilheteSelecionado = null;
        this.carregar();
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Erro ao fazer check-out';
        this.toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  }

  confirmarDelete(bilhete: Bilhete) {
    this.bilheteParaDeletar = bilhete;
    this.confirmAberto = true;
  }

  deletar() {
    if (!this.bilheteParaDeletar) return;
    this.bilheteService.remove(this.bilheteParaDeletar.id_bilhete).subscribe({
      next: () => {
        this.toast.success('Bilhete removido!');
        this.confirmAberto = false;
        this.bilheteParaDeletar = null;
        this.carregar();
      },
      error: () => {
        this.toast.error('Erro ao remover bilhete');
        this.confirmAberto = false;
      },
    });
  }

  formatarData(data: string | null): string {
    if (!data) return '—';
    const d = new Date(data);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatarValor(valor: string | null): string {
    if (!valor) return '—';
    return `R$ ${Number(valor).toFixed(2)}`;
  }
}