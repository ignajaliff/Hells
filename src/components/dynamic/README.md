# Islas dinámicas

Client Components chicos conectados a Supabase para valores que deben verse al
instante (botón de WhatsApp, banner de promo, estado abierto/cerrado).

Reglas (ai-pmp/frontend-rules.txt § Patrón de isla dinámica):

- Renderizan el default de `lib/defaults.ts` primero y actualizan cuando llega
  la respuesta — nunca un hueco vacío ni un spinner.
- El `catch` es silencioso: si Supabase falla, queda el default y no se entera nadie.
- Una isla = un valor o grupo de valores relacionados.
- Reservan siempre el mismo alto que el contenido final (CLS).

Vacío por ahora: Supabase todavía no está conectado.
