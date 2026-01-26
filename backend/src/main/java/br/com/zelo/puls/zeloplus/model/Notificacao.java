package br.com.zelo.puls.zeloplus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacoes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String titulo;
    private String conteudo;

    private LocalDateTime dataEnvio = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private TipoNotificacao tipo;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Notificacao(String titulo, String conteudo, TipoNotificacao tipo, Usuario usuario) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.tipo = tipo;
        this.usuario = usuario;
        this.dataEnvio = LocalDateTime.now();
    }
}
