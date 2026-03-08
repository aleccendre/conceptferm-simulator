export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nom, telephone, email, adresse, type_logement } = req.body;

  // 1. Envoi email Resend
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.RESEND_API_KEY
    },
    body: JSON.stringify({
      from: "Simulateur Conceptferm <onboarding@resend.dev>",
      to: "a.francois@conceptferm.fr",
      subject: "Nouveau lead - " + nom,
      html: "<h2>Nouveau lead</h2>" +
            "<p><strong>Nom :</strong> " + nom + "</p>" +
            "<p><strong>Telephone :</strong> " + telephone + "</p>" +
            "<p><strong>Email :</strong> " + email + "</p>" +
            "<p><strong>Adresse :</strong> " + adresse + "</p>" +
            "<p><strong>Type de logement :</strong> " + type_logement + "</p>"
    })
  });

  // 2. Token Sellsy
  const tokenResponse = await fetch("https://login.sellsy.com/oauth2/access-tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.SELLSY_CLIENT_ID,
      client_secret: process.env.SELLSY_CLIENT_SECRET
    })
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // 3. Création contact Sellsy
  const nomParts = nom.split(" ");
  const prenom = nomParts[0];
  const nomFamille = nomParts.slice(1).join(" ") || "-";

  await fetch("https://api.sellsy.com/v2/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    },
    body: JSON.stringify({
      firstname: prenom,
      lastname: nomFamille,
      email: email,
      mobile: telephone,
      address: {
        addressLine1: adresse
      }
    })
  });

  return res.status(200).json({ success: true });
}