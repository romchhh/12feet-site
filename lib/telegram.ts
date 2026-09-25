function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram is not configured");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error: ${res.status} ${body}`);
  }
}

export function formatBookingTelegramMessage(input: {
  locale: string;
  date: string;
  time: string;
  tableNumber: 1 | 2;
  hours: number;
  name: string;
  phone: string;
  rate: number;
  total: number;
}): string {
  const lines = [
    "<b>🎱 Нова rezervácia · 12 FEET</b>",
    "",
    `<b>Dátum:</b> ${escapeHtml(input.date)} · ${escapeHtml(input.time)}`,
    `<b>Stôl:</b> ${input.tableNumber}`,
    `<b>Hodín:</b> ${input.hours}`,
    `<b>Sadzba:</b> ${input.rate} €/hod`,
    `<b>Spolu:</b> ${input.total} €`,
    "",
    `<b>Meno:</b> ${escapeHtml(input.name)}`,
    `<b>Telefón:</b> ${escapeHtml(input.phone)}`,
    `<b>Jazyk webu:</b> ${escapeHtml(input.locale)}`,
  ];
  return lines.join("\n");
}
