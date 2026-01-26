package br.com.zelo.puls.zeloplus.service;

import br.com.zelo.puls.zeloplus.model.Usuario;
import org.springframework.stereotype.Service;

@Service
public class NotificacaoService {

    private final EmailService emailService;
    private final ExpoPushService expoPushService;

    public NotificacaoService(EmailService emailService, ExpoPushService expoPushService) {
        this.emailService = emailService;
        this.expoPushService = expoPushService;
    }

    public void enviarNotificacao(Usuario usuario, String titulo, String mensagem) {
        if (usuario == null) return;
        System.out.println("VAI");
        if (usuario.getTokenExpo() != null && !usuario.getTokenExpo().isEmpty()) {
            expoPushService.sendNotification(usuario.getTokenExpo(), titulo, mensagem);
        }

        if (usuario.getEmail() != null && !usuario.getEmail().isEmpty()) {
            System.out.println("NOTI");
            emailService.enviarEmail(usuario.getEmail(), titulo, mensagem);
        }
    }
}
