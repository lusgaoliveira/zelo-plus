package br.com.zelo.puls.zeloplus.dto;


import jakarta.validation.constraints.NotBlank;

public record LoginRespostaDTO(
        Integer id,
        String nomeUsuario,
        String fotoPerfil,
        String nome,
        @NotBlank
        String tipoUsuario,
        Integer codigo
) {
}
