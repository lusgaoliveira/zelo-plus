package br.com.zelo.puls.zeloplus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ZeloplusApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZeloplusApplication.class, args);
	}

}
