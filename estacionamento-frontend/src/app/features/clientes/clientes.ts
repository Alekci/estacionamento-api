import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';



import { ToastService } from '../../shared/components/toast/toast.service';
import { ClienteService } from '../../core/services/cliente.service';
import {
  Cliente,
  CreateClienteDto,
} from '../../core/models/cliente.model';
import { Header } from '../../shared/components/header/header';
import { Modal } from '../../shared/components/modal/modal';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    Modal,
    ConfirmDialog
  ],
  templateUrl: './clientes.html',
})
export class Clientes implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private toast = inject(ToastService);

  clientes = signal<Cliente[]>([]);
  filtro = signal('');

  modalAberto = false;
  editando = false;
  clienteEditandoId: number | null = null;

  confirmAberto = false;
  clienteParaDeletar: Cliente | null = null;

  form = this.fb.group({
    nome_cliente: ['', Validators.required],
    cpf_cliente: ['', Validators.required],
    telefone_cliente: ['', Validators.required],
    endereco_cliente: ['', Validators.required],
  });

  get clientesFiltrados(): Cliente[] {
    const termo = this.filtro().toLowerCase().trim();
    if (!termo) return this.clientes();
    return this.clientes().filter(
      (c) =>
        c.nome_cliente.toLowerCase().includes(termo) ||
        c.cpf_cliente.includes(termo) ||
        c.telefone_cliente.includes(termo),
    );
  }

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.clienteService.findAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: () => this.toast.error('Erro ao carregar clientes'),
    });
  }

  abrirNovo() {
    this.editando = false;
    this.clienteEditandoId = null;
    this.form.reset();
    this.modalAberto = true;
  }

  abrirEdicao(cliente: Cliente) {
    this.editando = true;
    this.clienteEditandoId = cliente.id_cliente;
    this.form.patchValue(cliente);
    this.modalAberto = true;
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value as CreateClienteDto;

    if (this.editando && this.clienteEditandoId !== null) {
      this.clienteService.update(this.clienteEditandoId, dto).subscribe({
        next: () => {
          this.toast.success('Cliente atualizado!');
          this.modalAberto = false;
          this.carregar();
        },
        error: (err) => {
          const msg = err.error?.message ?? 'Erro ao atualizar';
          this.toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
        },
      });
    } else {
      this.clienteService.create(dto).subscribe({
        next: () => {
          this.toast.success('Cliente criado!');
          this.modalAberto = false;
          this.carregar();
        },
        error: (err) => {
          const msg = err.error?.message ?? 'Erro ao criar';
          this.toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
        },
      });
    }
  }

  confirmarDelete(cliente: Cliente) {
    this.clienteParaDeletar = cliente;
    this.confirmAberto = true;
  }

  deletar() {
    if (!this.clienteParaDeletar) return;
    this.clienteService.remove(this.clienteParaDeletar.id_cliente).subscribe({
      next: () => {
        this.toast.success('Cliente removido!');
        this.confirmAberto = false;
        this.clienteParaDeletar = null;
        this.carregar();
      },
      error: () => {
        this.toast.error('Erro ao remover. Verifique se há veículos vinculados.');
        this.confirmAberto = false;
      },
    });
  }
}