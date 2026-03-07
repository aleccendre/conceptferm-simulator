console.log("app.js charge");

const SUPABASE_URL = "https://yaxghvguiumgyuhwhwpo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheGdodmd1aXVtZ3l1aHdod3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NjUyNzMsImV4cCI6MjA4ODQ0MTI3M30.HYGXMXLjCOTComA3mzQvTisy8bXXhd9k_n75AgkCvPs";

const bouton = document.getElementById("boutonSimuler");
const champAdresse = document.getElementById("adresse");
const champType = document.getElementById("typeLogement");
const resultat = document.getElementById("resultat");
const etape2 = document.getElementById("etape2");
const boutonContact = document.getElementById("boutonContact");
const confirmation = document.getElementById("confirmation");

function estimerTravaux(typeLogement) {
  if (typeLogement === "appartement") {
    return { fenetres: 3, coutMin: 3000, coutMax: 5000 };
  } else if (typeLogement === "maison") {
    return { fenetres: 6, coutMin: 6000, coutMax: 10000 };
  } else if (typeLogement === "maison_grande") {
    return { fenetres: 10, coutMin: 10000, coutMax: 16000 };
  }
}

bouton.addEventListener("click", function() {
  console.log("bouton clique");

  const adresse = champAdresse.value;
  const typeLogement = champType.value;

  if (adresse === "") {
    resultat.textContent = "Veuillez entrer une adresse.";
    return;
  }

  if (typeLogement === "") {
    resultat.textContent = "Veuillez choisir un type de logement.";
    return;
  }

  const url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(adresse) + "&limit=1";

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log("data API :", data);
      const premier = data.features[0];
      const score = premier.properties.score;
      const estimation = estimerTravaux(typeLogement);
      let fiabilite;
      if (score > 0.8) {
        fiabilite = "Adresse trouvee avec precision";
      } else {
        fiabilite = "Adresse approximative";
      }

      resultat.innerHTML =
        "<h2>Resultats pour " + adresse + "</h2>" +
        "<p>" + fiabilite + "</p>" +
        "<p>Nombre de fenetres estime : " + estimation.fenetres + "</p>" +
        "<p>Estimation travaux : entre " + estimation.coutMin + "EUR et " + estimation.coutMax + "EUR</p>";

      etape2.style.display = "block";
    });
});

boutonContact.addEventListener("click", function() {
  const nom = document.getElementById("nom").value;
  const telephone = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;

  if (nom === "" || telephone === "" || email === "") {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const lead = {
    nom: nom,
    telephone: telephone,
    email: email,
    adresse: champAdresse.value,
    type_logement: champType.value
  };

  fetch(SUPABASE_URL + "/rest/v1/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY
    },
    body: JSON.stringify(lead)
  })
  .then(function(response) {
    if (response.ok) {
      etape2.style.display = "none";
      confirmation.style.display = "block";
    } else {
      alert("Une erreur est survenue. Reessayez.");
    }
  });
});