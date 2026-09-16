import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


import { ToastService } from '../../shared/components/toast/toast.service';
import { VeiculoService } from '../../core/services/veiculo.service';
import { ClienteService } from '../../core/services/cliente.service';
import {
  Veiculo,
  CreateVeiculoDto,
} from '../../core/models/veiculo.model';
import { Cliente } from '../../core/models/cliente.model';
import { Header } from '../../shared/components/header/header';
import { Modal } from '../../shared/components/modal/modal';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './veiculos.html',
})
export class Veiculos implements OnInit {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private clienteService = inject(ClienteService);
  private toast = inject(ToastService);

  veiculos = signal<Veiculo[]>([]);
  clientes = signal<Cliente[]>([]);
  filtro = signal('');

  modalAberto = false;
  editando = false;
  veiculoEditandoId: number | null = null;

  confirmAberto = false;
  veiculoParaDeletar: Veiculo | null = null;

  form = this.fb.group({
    placa_veiculo: ['', [Validators.required, Validators.maxLength(7)]],
    marca_modelo_veiculo: [''],
    cor_veiculo: [''],
    Cliente_id_cliente: [null as number | null, Validators.required],
  });

  get veiculosFiltrados(): Veiculo[] {
    const termo = this.filtro().toLowerCase().trim();
    if (!termo) return this.veiculos();
    return this.veiculos().filter(
      (v) =>
        v.placa_veiculo.toLowerCase().includes(termo) ||
        v.marca_modelo_veiculo?.toLowerCase().includes(termo) ||
        v.cliente?.nome_cliente.toLowerCase().includes(termo),
    );
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.veiculoService.findAll().subscribe({
      next: (data) => this.veiculos.set(data),
      error: () => this.toast.error('Erro ao carregar veículos'),
    });
    this.clienteService.findAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: () => this.toast.error('Erro ao carregar clientes'),
    });
  }

  abrirNovo() {
    this.editando = false;
    this.veiculoEditandoId = null;
    this.form.reset();
    this.modalAberto = true;
  }

  abrirEdicao(veiculo: Veiculo) {
    this.editando = true;
    this.veiculoEditandoId = veiculo.id_veiculo;
    this.form.patchValue({
      placa_veiculo: veiculo.placa_veiculo,
      marca_modelo_veiculo: veiculo.marca_modelo_veiculo ?? '',
      cor_veiculo: veiculo.cor_veiculo ?? '',
      Cliente_id_cliente: veiculo.Cliente_id_cliente,
    });
    this.modalAberto = true;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = this.form.value as CreateVeiculoDto;

    const req$ =
      this.editando && this.veiculoEditandoId !== null
        ? this.veiculoService.update(this.veiculoEditandoId, dto)
        : this.veiculoService.create(dto);

    req$.subscribe({
      next: () => {
        this.toast.success(this.editando ? 'Veículo atualizado!' : 'Veículo criado!');
        this.modalAberto = false;
        this.carregar();
      },
      error: (err) => {
        const msg = err.error?.message ?? 'Erro ao salvar';
        this.toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  }

  confirmarDelete(veiculo: Veiculo) {
    this.veiculoParaDeletar = veiculo;
    this.confirmAberto = true;
  }

  deletar() {
    if (!this.veiculoParaDeletar) return;
    this.veiculoService.remove(this.veiculoParaDeletar.id_veiculo).subscribe({
      next: () => {
        this.toast.success('Veículo removido!');
        this.confirmAberto = false;
        this.veiculoParaDeletar = null;
        this.carregar();
      },
      error: () => {
        this.toast.error('Erro ao remover. Verifique se há bilhetes vinculados.');
        this.confirmAberto = false;
      },
    });
  }
}