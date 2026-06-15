/**
 * Утилита для имитации отправки email уведомлений.
 * В будущем здесь можно подключить Resend, Nodemailer или SendGrid.
 */
export async function sendEmailNotification({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // В реальном приложении здесь был бы вызов API провайдера
  console.log(`
[EMAIL SYSTEM] Отправка письма:
Кому: ${to}
Тема: ${subject}
Текст: ${text}
-----------------------------------
  `);

  // Имитируем сетевую задержку
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true };
}
