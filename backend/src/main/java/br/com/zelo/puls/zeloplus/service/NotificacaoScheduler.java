package br.com.zelo.puls.zeloplus.service;

import br.com.zelo.puls.zeloplus.model.StatusTarefa;
import br.com.zelo.puls.zeloplus.model.Tarefa;
import br.com.zelo.puls.zeloplus.repository.TarefaRepository;
import br.com.zelo.puls.zeloplus.repository.CuidadorRepository;
import br.com.zelo.puls.zeloplus.model.Cuidador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class NotificacaoScheduler {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    @Scheduled(fixedRate = 60000)
    public void verificarETratarNotificacoes() {
        LocalDateTime agora = LocalDateTime.now();

        // 1. Tarefas AGENDADAS
        List<Tarefa> agendadas = tarefaRepository.findByStatus(StatusTarefa.AGENDADA);

        for (Tarefa tarefa : agendadas) {
            if (!tarefa.isConfirmada() && agora.isAfter(tarefa.getDataAgendamento())) {
                tarefa.setStatus(StatusTarefa.EXPIRADA);
                tarefaRepository.save(tarefa);
            } else if (deveNotificarIdoso(tarefa, agora)) {
                notificacaoService.enviarNotificacao(
                        tarefa.getIdoso().getUsuario(),
                        "Lembrete!",
                        "Você tem uma tarefa agendada em breve!"
                );
            }
        }

        List<Tarefa> expiradas = tarefaRepository.findByStatus(StatusTarefa.EXPIRADA);

        for (Tarefa tarefa : expiradas) {
            if (deveNotificarCuidador(tarefa)) {
                cuidadorRepository.findByIdoso(tarefa.getIdoso())
                        .map(Cuidador::getUsuario)
                        .ifPresent(usuario ->
                                notificacaoService.enviarNotificacao(
                                        usuario,
                                        "Atenção!",
                                        "O idoso não confirmou a tarefa agendada há mais de 30 minutos."
                                )
                        );
            }
        }
    }

    private boolean deveNotificarIdoso(Tarefa tarefa, LocalDateTime agora) {
        long minutosRestantes = Duration.between(agora, tarefa.getDataAgendamento()).toMinutes();
        return minutosRestantes <= 15 && minutosRestantes >= 0;
    }

    private boolean deveNotificarCuidador(Tarefa tarefa) {
        LocalDateTime agora = LocalDateTime.now();
        return Duration.between(tarefa.getDataAgendamento(), agora).toMinutes() >= 30 &&
                !tarefa.isConfirmada();
    }
}
