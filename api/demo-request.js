
const EMAIL_TO = process.env.DEMO_TO_EMAIL || "finovasys@gmail.com";
const EMAIL_FROM = process.env.DEMO_FROM_EMAIL;

function clean(value, max = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Metode tidak diizinkan.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !EMAIL_FROM) {
    console.error(
      "Demo email is not configured: set RESEND_API_KEY and DEMO_FROM_EMAIL."
    );

    return res.status(503).json({
      success: false,
      error:
        "Pengiriman email belum diaktifkan oleh administrator website. Silakan coba kembali nanti.",
    });
  }

  try {
    const body = req.body || {};

    const name = clean(body.name, 120);
    const company = clean(body.company, 160);
    const email = clean(body.email, 254);
    const whatsapp = clean(body.whatsapp, 40);
    const rawIndustry = clean(body.industry, 160);
    const industryOther = clean(body.industry_other, 160);
    const employees = clean(body.employees, 80);
    const need = clean(body.need, 160);
    const needOther = clean(body.needOther || body.need_other, 2000);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const whatsappDigits = whatsapp.replace(/\D/g, "");

    if (
      !name ||
      !company ||
      !emailPattern.test(email) ||
      !whatsapp ||
      whatsappDigits.length < 8 ||
      whatsappDigits.length > 15 ||
      !rawIndustry ||
      !employees ||
      !need
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Mohon lengkapi semua kolom dengan data yang valid, termasuk email dan nomor WhatsApp.",
      });
    }

    if (
      rawIndustry.toLowerCase() === "lainnya" &&
      !industryOther
    ) {
      return res.status(400).json({
        success: false,
        error: "Mohon tuliskan bidang usaha Anda.",
      });
    }

    if (
      need.toLowerCase() === "lainnya" &&
      !needOther
    ) {
      return res.status(400).json({
        success: false,
        error: "Mohon jelaskan kebutuhan demo Anda.",
      });
    }

    const industry =
      rawIndustry.toLowerCase() === "lainnya"
        ? industryOther
        : rawIndustry;

    const finalNeed =
      need.toLowerCase() === "lainnya"
        ? `Lainnya: ${needOther}`
        : need;

    const submittedAt = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    const rows = [
      ["Nama lengkap", name],
      ["Nama perusahaan", company],
      ["Email bisnis calon klien", email],
      ["Nomor WhatsApp", whatsapp],
      ["Bidang usaha", industry],
      ["Jumlah karyawan", employees],
      ["Kebutuhan utama", finalNeed],
      ["Waktu permintaan (WIB)", submittedAt],
    ];

    const html = `
      <div style="font-family:Arial,sans-serif;color:#14264b;max-width:680px;margin:auto">
        <div style="background:linear-gradient(120deg,#071b50,#0758e8);padding:28px;border-radius:16px;color:#fff">
          <h1 style="margin:0;font-size:24px">Permintaan Sesi Demo FINOVA</h1>
          <p style="margin:8px 0 0">
            Ada calon klien yang mengajukan sesi demo melalui website FINOVA.
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:20px">
          ${rows.map(([label, value]) => `
            <tr>
              <th style="text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #e5eaf3;width:40%">
                ${escapeHtml(label)}
              </th>
              <td style="padding:12px;border-bottom:1px solid #e5eaf3;overflow-wrap:anywhere">
                ${escapeHtml(value)}
              </td>
            </tr>
          `).join("")}
        </table>

        <p style="color:#64748b;font-size:12px;margin-top:22px">
          Email ini dikirim otomatis oleh formulir website FINOVA.
        </p>
      </div>
    `;

    const text = [
      "PERMINTAAN SESI DEMO FINOVA",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ].join("\n");

    const emailResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [EMAIL_TO],
          reply_to: email,
          subject: `Permintaan Demo FINOVA - ${company}`,
          html,
          text,
        }),
      }
    );

    if (!emailResponse.ok) {
      const details = await emailResponse.text();

      console.error(
        "Resend rejected demo email:",
        emailResponse.status,
        details.slice(0, 1000)
      );

      return res.status(502).json({
        success: false,
        error:
          "Email belum berhasil dikirim. Silakan coba kembali atau hubungi FINOVA.",
      });
    }

    const result = await emailResponse.json();

    return res.status(200).json({
      success: true,
      id: result.id,
    });
  } catch (error) {
    console.error("Demo email send failed:", error);

    return res.status(502).json({
      success: false,
      error:
        "Terjadi kendala saat mengirim email. Silakan coba kembali.",
    });
  }
};
