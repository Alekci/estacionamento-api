import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Header } from '../../shared/components/header/header';
import { VagaService } from '../../core/services/vaga.service';
import { BilheteService } from '../../core/services/bilhete.service';
import { ClienteService } from '../../core/services/cliente.service';
import { VeiculoService } from '../../core/services/veiculo.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private vagaService = inject(VagaService);
  private bilheteService = inject(BilheteService);
  private clienteService = inject(ClienteService);
  private veiculoService = inject(VeiculoService);

  totalVagas = signal(0);
  vagasOcupadas = signal(0);
  vagasDisponiveis = computed(() => this.totalVagas() - this.vagasOcupadas());
  totalClientes = signal(0);
  totalVeiculos = signal(0);
  bilhetesAbertos = signal(0);
  faturamentoHoje = signal(0);

  ngOnInit() {
    forkJoin({
      vagas: this.vagaService.findAll(),
      abertos: this.bilheteService.findAbertos(),
      finalizados: this.bilheteService.findFinalizados(),
      clientes: this.clienteService.findAll(),
      veiculos: this.veiculoService.findAll(),
    }).subscribe({
      next: (res) => {
        this.totalVagas.set(res.vagas.length);
        this.bilhetesAbertos.set(res.abertos.length);
        this.vagasOcupadas.set(res.abertos.length);
        this.totalClientes.set(res.clientes.length);
        this.totalVeiculos.set(res.veiculos.length);

        const hoje = new Date().toISOString().split('T')[0];
        const faturamento = res.finalizados
          .filter((b) => b.hora_saida_bilhete?.startsWith(hoje))
          .reduce((acc, b) => acc + Number(b.valor_bilhete ?? 0), 0);
        this.faturamentoHoje.set(faturamento);
      },
      error: () => {
        // silencioso, dashboard pode ficar com zeros
      },
    });
  }
}