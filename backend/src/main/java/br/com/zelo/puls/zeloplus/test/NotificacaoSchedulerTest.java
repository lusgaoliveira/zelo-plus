//package br.com.zelo.puls.zeloplus.test;
//
//import br.com.zelo.puls.zeloplus.model.*;
//import br.com.zelo.puls.zeloplus.repository.TarefaRepository;
//import br.com.zelo.puls.zeloplus.service.FcmService;
//import br.com.zelo.puls.zeloplus.service.NotificacaoScheduler;
//import br.com.zelo.puls.zeloplus.service.NotificacaoService;
//import org.testng.annotations.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//import java.util.Collections;
//
//import static org.mockito.Mockito.*;
//
//@SpringBootTest
//public class NotificacaoSchedulerTest {
//
//    @Mock
//    private TarefaRepository tarefaRepository;
//
//    @Mock
//    private FcmService fcmService;
//
//    @InjectMocks
//    private NotificacaoService notificacaoService;
//
//    @InjectMocks
//    private NotificacaoScheduler notificacaoScheduler;
//
//    public NotificacaoSchedulerTest() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void deveEnviarNotificacaoParaIdosoProximaTarefa() {
//        // Configurar tarefa simulada
//        Usuario usuarioIdoso = new Usuario();
//        usuarioIdoso.setTokenExpo("token_teste");
//
//        Idoso idoso = new Idoso();
//        idoso.setUsuario(usuarioIdoso);
//
//        Tarefa tarefa = new Tarefa(
//                null, // ou algum id se tiver
//                "Tomar remédio",
//                "Remédio de pressão",
//                LocalDateTime.now(),
//                LocalDateTime.now().plusMinutes(10),
//                null,// exemplo de tipo
//                idoso, // objeto da classe Idoso
//                1, // nível de prioridade ou dificuldade
//                StatusTarefa.AGENDADA
//        );
//        // não confirmada
//
//        // Mock do repositório
//        when(tarefaRepository.findAll()).thenReturn(Collections.singletonList(tarefa));
//
//        // Mock do envio
//        when(fcmService.sendNotification(any(), any(), any())).thenReturn("mock_message_id");
//
//        // Executar a lógica de agendamento
//        notificacaoScheduler.verificarETratarNotificacoes();
//
//        // Verificar se o envio foi chamado corretamente
//        verify(fcmService, times(1)).sendNotification(
//                eq("token_teste"),
//                eq("Lembrete!"),
//                eq("Você tem uma tarefa em breve!")
//        );
//    }
//}
