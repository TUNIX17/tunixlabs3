/**
 * Telegram webhook receiver.
 *
 * Telegram calls this endpoint for each update directed at @Tunixlabschat_bot.
 * We only process updates from the bot owner (Alejandro) — anyone else who
 * finds the bot gets a polite "this bot is private" reply and nothing else.
 *
 * Owner messages of the form `@<id> <content>` are parsed and posted into
 * the matching Chatwoot conversation as an agent outgoing message. Chatwoot
 * then broadcasts it over ActionCable to the visitor's terminal in <1s.
 *
 * Other owner messages (notes, `/start`, typos) get a usage hint.
 */
import type { NextRequest } from 'next/server';
import {
  sendMessage,
  parseConversationReply,
  getOwnerChatId,
  type TelegramUpdate,
} from '@/lib/telegram/bot';
import { postAgentMessage, ChatwootAdminError } from '@/lib/chatwoot/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const USAGE_HINT =
  'Uso: responde un mensaje del web con `@<id> tu respuesta`.\n\n' +
  'Ej: `@847 hola, cuéntame más del proyecto`\n\n' +
  'El `<id>` es el número que aparece en `💬 Web #<id>`.';

export async function POST(req: NextRequest) {
  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return Response.json({ ok: true, skipped: 'invalid_json' });
  }

  const message = update.message;
  if (!message || !message.from) {
    return Response.json({ ok: true, skipped: 'no_message' });
  }

  let ownerId: number;
  try {
    ownerId = getOwnerChatId();
  } catch {
    return Response.json({ ok: true, skipped: 'owner_not_configured' });
  }

  // Reject anyone who is not the owner — the bot is private to Alejandro
  if (message.from.id !== ownerId) {
    try {
      await sendMessage(
        message.chat.id,
        'Este bot es privado. Escribe a contacto@tunixlabs.com o vía tunixlabs.com/contacto.'
      );
    } catch {}
    return Response.json({ ok: true, skipped: 'not_owner' });
  }

  const text = (message.text ?? '').trim();

  // Bootstrap commands
  if (text === '/start' || text === '/help') {
    await sendMessage(
      ownerId,
      `Bot listo.\n\n${USAGE_HINT}\n\nLos mensajes nuevos del web chat aparecerán acá con formato:\n\n💬 Web #<id> · <visitor>\n<mensaje>\n\nResponde: @<id> tu respuesta`
    );
    return Response.json({ ok: true, handled: 'start' });
  }

  // Parse "@<id> <content>"
  const reply = parseConversationReply(text);
  if (!reply) {
    await sendMessage(ownerId, USAGE_HINT);
    return Response.json({ ok: true, skipped: 'no_conv_match' });
  }

  try {
    await postAgentMessage(reply.conversationId, reply.content);
    await sendMessage(ownerId, `✅ Enviado a #${reply.conversationId}`);
    return Response.json({
      ok: true,
      delivered: true,
      conversationId: reply.conversationId,
    });
  } catch (e) {
    const err =
      e instanceof ChatwootAdminError ? e.message : String(e);
    await sendMessage(
      ownerId,
      `❌ Error al enviar a #${reply.conversationId}: ${err.slice(0, 200)}`
    );
    return Response.json({ ok: true, delivered: false, error: err });
  }
}

export async function GET() {
  return Response.json({ ok: true, endpoint: 'telegram-webhook' });
}
