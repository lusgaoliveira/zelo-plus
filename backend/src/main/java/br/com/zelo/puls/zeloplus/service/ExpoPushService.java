package br.com.zelo.puls.zeloplus.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExpoPushService {

    private final RestTemplate restTemplate;

    public ExpoPushService() {
        this.restTemplate = new RestTemplate();
    }

    public String sendNotification(String expoPushToken, String title, String body) {
        if (expoPushToken == null || !expoPushToken.startsWith("ExponentPushToken")) {
            System.err.println("Token inválido para notificação Expo");
            return null;
        }

        String url = "https://exp.host/--/api/v2/push/send";

        Map<String, Object> payload = new HashMap<>();
        payload.put("to", expoPushToken);
        payload.put("title", title);
        payload.put("body", body);
        payload.put("sound", "default");
        payload.put("priority", "high");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("Resposta do Expo Push: " + response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao enviar notificação Expo: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
