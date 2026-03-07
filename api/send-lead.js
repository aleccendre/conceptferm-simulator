export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nom, telephone, email, adresse, type_logement } = req.body;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.RESEND_API_KEY
    },
    body: JSON.stringify({
      from: "Simulateur Conceptferm <onboarding@resend.dev>",
      to: "alexandre.francois0901@gmail.com",
      subject: "Nouveau lead - " + nom,
      html: "<h2>Nouveau lead</h2>" +
            "<p><strong>Nom :</strong> " + nom + "</p>" +
            "<p><strong>Téléphone :</strong> " + telephone + "</p>" +
            "<p><strong>Email :</strong> " + email + "</p>" +
            "<p><strong>Adresse :</strong> " + adresse + "</p>" +
            "<p><strong>Type de logement :</strong> " + type_logement + "</p>"
    })
  });

  if (response.ok) {
    return res.status(200).json({ success: true });
  } else {
    const error = await response.json();
    return res.status(500).json({ error: error });
  }
}