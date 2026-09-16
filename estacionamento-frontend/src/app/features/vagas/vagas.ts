import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '../../shared/components/toast/toast.service';
import { VagaService } from '../../core/services/vaga.service';
import {
  Vaga,
  TipoVaga,
  CreateVagaDto,
} from '../../core/models/vaga.model';
import { Header } from '../../shared/components/header/header';
import { Modal } from '../../shared/components/modal/modal';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './vagas.html',
})
export class Vagas implements OnInit {
  private fb = inject(FormBuilder);
  private vagaService = inject(VagaService);
  private toast = inject(ToastService);

  vagas = signal<Vaga[]>([]);
  vagasDisponiveis = signal<Vaga[]>([]);
  filtro = signal('');
  apenasDisponiveis = signal(false);

  modalAberto = false;
  editando = false;
  vagaEditandoId: number | null = null;

  confirmAberto = false;
  vagaParaDeletar: Vaga | null = null;

  tipos = [TipoVaga.PCD, TipoVaga.COMUM];

  form = this.fb.group({
    numero_vaga: [null as number | null, Validators.required],
    tipo_vaga: [TipoVaga.COMUM as TipoVaga, Validators.required],
  });

  get vagasFiltradas(): Vaga[] {
    const base = this.apenasDisponiveis() ? this.vagasDisponiveis() : this.vagas();
    const termo = this.filtro().toLowerCase().trim();
    if (!termo) return base;
    return base.filter(
      (v) =>
        v.numero_vaga.toString().includes(termo) ||
        v.tipo_vaga.toLowerCase().includes(termo),
    );
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.vagaService.findAll().subscribe({
      next: (data) => this.vagas.set(data),
      error: () => this.toast.error('Erro ao carregar vagas'),
    });
    this.vagaService.findDisponiveis().subscribe({
      next: (data) => this.vagasDisponiveis.set(data),
      error: () => this.toast.error('Erro ao carregar vagas disponíveis'),
    });
  }

  abrirNovo() {
    this.editando = false;
    this.vagaEditandoId = null;
    this.form.reset({ tipo_vaga: TipoVaga.COMUM });
    this.modalAberto = true;
  }

  abrirEdicao(vaga: Vaga) {
    this.editando = true;
    this.vagaEditandoId = vaga.id_vaga;
    this.form.patchValue({
      numero_vaga: vaga.numero_vaga,
      tipo_vaga: vaga.tipo_vaga,
    });
    this.modalAberto = true;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = this.form.value as CreateVagaDto;

    const req$ =
      this.editando && this.vagaEditandoId !== null
        ? this.vagaService.update(this.vagaEditandoId, dto)
        : this.vagaService.create(dto);

    req$.subscribe({
      next: () => {
        this.toast.success(this.editando ? 'Vaga atualizada!' : 'Vaga criada!');
        this.modalAberto = false;
        this.carregar();
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Erro ao salvar';
        this.toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  }

  confirmarDelete(vaga: Vaga) {
    this.vagaParaDeletar = vaga;
    this.confirmAberto = true;
  }

  deletar() {
    if (!this.vagaParaDeletar) return;
    this.vagaService.remove(this.vagaParaDeletar.id_vaga).subscribe({
      next: () => {
        this.toast.success('Vaga removida!');
        this.confirmAberto = false;
        this.vagaParaDeletar = null;
        this.carregar();
      },
      error: () => {
        this.toast.error('Erro ao remover. Verifique se a vaga está ocupada.');
        this.confirmAberto = false;
      },
    });
  }

  estaOcupada(vaga: Vaga): boolean {
    return !this.vagasDisponiveis().some((v) => v.id_vaga === vaga.id_vaga);
  }
}