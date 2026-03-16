const GOLD = "hsl(38,68%,44%)"
const DARK_BG = "#0d0905"
const CARD_BG = "#17130d"
const BORDER = "rgba(160,112,32,0.22)"
const TEXT_MUTED = "rgba(255,255,255,0.38)"
const TEXT_DIM = "rgba(255,255,255,0.18)"

function base(content: string): string {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:${DARK_BG};font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK_BG};padding:48px 16px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:${CARD_BG};border:1px solid ${BORDER};">

        <!-- HEADER -->
        <tr>
          <td style="padding:32px 40px 28px;border-bottom:1px solid rgba(160,112,32,0.14);text-align:center;">
            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;">
              <tr>
                <td style="width:48px;height:1px;background:linear-gradient(to right,transparent,rgba(160,112,32,0.35));"></td>
                <td style="width:8px;height:8px;background:rgba(160,112,32,0.6);transform:rotate(45deg);margin:0 8px;"></td>
                <td style="width:6px;height:6px;background:rgba(160,112,32,0.28);transform:rotate(45deg);margin:0 4px;"></td>
                <td style="width:8px;height:8px;background:rgba(160,112,32,0.6);transform:rotate(45deg);margin:0 8px;"></td>
                <td style="width:48px;height:1px;background:linear-gradient(to left,transparent,rgba(160,112,32,0.35));"></td>
              </tr>
            </table>
            <span style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:600;color:rgba(255,255,255,0.82);letter-spacing:0.18em;text-transform:uppercase;">
              Meșteri de Tulcea
            </span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:20px 40px 24px;border-top:1px solid rgba(160,112,32,0.1);text-align:center;">
            <p style="margin:0;font-size:10px;color:${TEXT_DIM};letter-spacing:0.14em;text-transform:uppercase;line-height:1.8;">
              Meșteri de Tulcea · Platforma meșterilor locali din Tulcea
            </p>
            <p style="margin:6px 0 0;font-size:10px;color:rgba(255,255,255,0.1);">
              Dacă nu ai inițiat această acțiune, poți ignora acest email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function ctaButton(href: string, label: string): string {
  return `
  <table cellpadding="0" cellspacing="0" width="100%" style="margin:28px 0;">
    <tr>
      <td align="center">
        <a href="${href}"
          style="display:inline-block;background:${GOLD};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;padding:15px 40px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>
  <p style="margin:0;font-size:11px;color:${TEXT_DIM};text-align:center;line-height:1.7;">
    Sau copiază link-ul în browser:<br/>
    <a href="${href}" style="color:${GOLD};word-break:break-all;font-size:10px;">${href}</a>
  </p>`
}

function overline(text: string): string {
  return `<p style="margin:0 0 10px;font-size:10px;color:${GOLD};letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">${text}</p>`
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:rgba(255,255,255,0.92);line-height:1.25;">${text}</h1>`
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 0;font-size:14px;color:${TEXT_MUTED};line-height:1.75;font-family:Arial,Helvetica,sans-serif;">${text}</p>`
}

/* ─── PUBLIC TEMPLATES ─────────────────────────────────────────────── */

export function buildConfirmEmail(name: string, confirmUrl: string): string {
  const greeting = name ? `Bun venit, <strong style="color:rgba(255,255,255,0.75);">${name}</strong>!` : "Bun venit!"
  return base(`
    ${overline("Confirmare cont")}
    ${heading("Confirmă adresa<br/>de email")}
    ${paragraph(`${greeting}<br/><br/>
      Ești aproape gata! Apasă butonul de mai jos pentru a-ți confirma adresa de email
      și a activa contul pe <span style="color:rgba(255,255,255,0.62);">Meșteri de Tulcea</span>.
    `)}
    ${ctaButton(confirmUrl, "Confirmă adresa de email")}
  `)
}

export function buildRecoveryEmail(name: string, resetUrl: string): string {
  const greeting = name ? `Salut, <strong style="color:rgba(255,255,255,0.75);">${name}</strong>!` : "Salut!"
  return base(`
    ${overline("Resetare parolă")}
    ${heading("Ai uitat parola?")}
    ${paragraph(`${greeting}<br/><br/>
      Am primit o cerere de resetare a parolei pentru contul asociat acestei adrese de email.
      Apasă butonul de mai jos pentru a seta o parolă nouă.
      <br/><br/>
      <span style="color:rgba(255,255,255,0.25);font-size:12px;">Link-ul expiră în 1 oră.</span>
    `)}
    ${ctaButton(resetUrl, "Resetează parola")}
  `)
}

export function buildEmailChangeEmail(name: string, confirmUrl: string): string {
  const greeting = name ? `Salut, <strong style="color:rgba(255,255,255,0.75);">${name}</strong>!` : "Salut!"
  return base(`
    ${overline("Modificare email")}
    ${heading("Confirmă noua<br/>adresă de email")}
    ${paragraph(`${greeting}<br/><br/>
      Ai solicitat schimbarea adresei de email pe platforma <span style="color:rgba(255,255,255,0.62);">Meșteri de Tulcea</span>.
      Apasă butonul de mai jos pentru a confirma noua adresă.
    `)}
    ${ctaButton(confirmUrl, "Confirmă noua adresă")}
  `)
}

export function buildMagicLinkEmail(name: string, magicUrl: string): string {
  const greeting = name ? `Salut, <strong style="color:rgba(255,255,255,0.75);">${name}</strong>!` : "Salut!"
  return base(`
    ${overline("Autentificare rapidă")}
    ${heading("Link de autentificare")}
    ${paragraph(`${greeting}<br/><br/>
      Apasă butonul de mai jos pentru a te autentifica instant pe
      <span style="color:rgba(255,255,255,0.62);">Meșteri de Tulcea</span> fără parolă.
      <br/><br/>
      <span style="color:rgba(255,255,255,0.25);font-size:12px;">Link-ul este valabil o singură dată și expiră în 1 oră.</span>
    `)}
    ${ctaButton(magicUrl, "Autentifică-te")}
  `)
}
