export function buildEmailHtml(title: string, rows: { label: string; value: string }[]) {
  const rowsHtml = rows
    .filter((r) => r.value)
    .map(
      (r) => `
        <tr>
          <td style="padding:8px 12px;font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#8a7a5c;white-space:nowrap;vertical-align:top;">${r.label}</td>
          <td style="padding:8px 12px;font-size:14px;color:#1c2612;">${escapeHtml(r.value).replace(/\n/g, "<br/>")}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;">
      <div style="background:#2d3a1e;color:#fdfbf7;padding:20px 24px;border-radius:12px 12px 0 0;">
        <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#d4af37;">ABD Culinary Events</p>
        <h1 style="margin:6px 0 0;font-size:20px;">${escapeHtml(title)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fdfbf7;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;">
        ${rowsHtml}
      </table>
      <p style="font-size:11px;color:#999;margin-top:12px;">Message envoyé automatiquement depuis le site abdculinaryevents.sn</p>
    </div>
  `;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
