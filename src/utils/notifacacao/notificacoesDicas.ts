import * as Notifications from "expo-notifications";

const dicasSaude = [
  "Beba água regularmente! 💧",
  "Dê uma caminhada leve! 🚶‍♀️",
  "Coma frutas hoje! 🍎🍌",
  "Alongue os braços e pernas! 🤸‍♂️",
  "Evite ficar muito tempo sentado! 🪑",
  "Respire fundo 3 vezes. Relaxa! 🧘‍♂️",
];

export async function agendarNotificacaoAleatoria() {
  const dica = dicasSaude[Math.floor(Math.random() * dicasSaude.length)];
  const seconds = Math.floor(Math.random() * 7200) + 600; 

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Dica de Saúde 🩺",
      body: dica,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false, 
    },
  });
}
