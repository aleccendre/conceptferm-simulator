console.log("app.js charge");

window.addEventListener("load", function() {

const SUPABASE_URL = "https://yaxghvguiumgyuhwhwpo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheGdodmd1aXVtZ3l1aHdod3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NjUyNzMsImV4cCI6MjA4ODQ0MTI3M30.HYGXMXLjCOTComA3mzQvTisy8bXXhd9k_n75AgkCvPs";

const bouton = document.getElementById("boutonSimuler");
const champAdresse = document.getElementById("adresse");
const champType = document.getElementById("typeLogement");
const resultat = document.getElementById("resultat");
const etape2 = document.getElementById("etape2");
const boutonContact = document.getElementById("boutonContact");
const confirmation = document.getElementById("confirmation");

function deduireVitrage(annee) {
  if (annee < 1975) {
    return "Simple vitrage (avant 1975)";
  } else if (annee < 1990) {
    return "Double vitrage ancien (1975-1990)";
  } else if (annee < 2010) {
    return "Double vitrage standard (1990-2010)";
  } else {
    return "Double vitrage recent (apres 2010)";
  }
}

function estimerFenetres(nbLog) {
  if (nbLog <= 1) {
    return 6;
  } else if (nbLog <= 3) {
    return nbLog * 4;
  } else {
    return nbLog * 3;
  }
}

function calculerPerteEnergetique(anneeNum, nbFenetres, typeEnergie) {
  var surfaceVitrage = nbFenetres * 1.5;
  var degreJours = 2800;

  var U;
  if (anneeNum < 1975) {
    U = 5.8;
  } else if (anneeNum < 1990) {
    U = 3.0;
  } else if (anneeNum < 2010) {
    U = 2.0;
  } else {
    U = 1.2;
  }

  var Unouveau = 1.1;
  var perteActuelle = U * surfaceVitrage * degreJours * 24 / 1000;
  var perteNouvelle = Unouveau * surfaceVitrage * degreJours * 24 / 1000;
  var economieKwh = Math.round(perteActuelle - perteNouvelle);

  var prixEnergie;
  if (typeEnergie === "gaz") prixEnergie = 0.13;
  else if (typeEnergie === "electricite") prixEnergie = 0.25;
  else if (typeEnergie === "fioul") prixEnergie = 0.12;
  else if (typeEnergie === "granules") prixEnergie = 0.07;
  else if (typeEnergie === "pac") prixEnergie = 0.08;
  else prixEnergie = 0.13;

  var economieEuros = Math.round(economieKwh * prixEnergie);

  return {
    perteActuelle: Math.round(perteActuelle),
    economieKwh: economieKwh,
    economieEuros: economieEuros
  };
}

bouton.addEventListener("click", function() {
  console.log("bouton clique");

  var adresse = champAdresse.value;

  if (adresse === "") {
    resultat.textContent = "Veuillez entrer une adresse.";
    return;
  }

  resultat.innerHTML = "<p>Recherche en cours...</p>";

  var urlAdresse = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(adresse) + "&limit=1";

  fetch(urlAdresse)
    .then(function(response) {
      return response.json();
    })
    .then(function(dataAdresse) {
      var premier = dataAdresse.features[0];
      var citycode = premier.properties.citycode;

      var urlBDNB = "https://api.bdnb.io/v1/bdnb/donnees/batiment_groupe_complet/adresse?cle_interop_adr=like." + citycode + "_*&select=batiment_groupe_id,nb_log,annee_construction,libelle_adr_principale_ban&limit=1";

      return fetch(urlBDNB)
        .then(function(response) {
          return response.json();
        })
        .then(function(dataBDNB) {
          console.log("BDNB:", dataBDNB);

          var nbFenetresEstime = 6;
          var anneeAffichee = "Inconnue";

          if (dataBDNB && dataBDNB.length > 0) {
            var batiment = dataBDNB[0];
            var annee = batiment.annee_construction;
            var nbLog = batiment.nb_log;
            var vitrage = deduireVitrage(annee);
            nbFenetresEstime = estimerFenetres(nbLog);
            anneeAffichee = annee;

            resultat.innerHTML =
              "<h2>Analyse pour " + adresse + "</h2>" +
              "<p>Annee de construction : " + anneeAffichee + "</p>" +
              "<p>Type de vitrage probable : " + vitrage + "</p>" +
              "<p>Nombre de fenetres estime : " + nbFenetresEstime + "</p>";
          } else {
            resultat.innerHTML =
              "<h2>Analyse pour " + adresse + "</h2>" +
              "<p>Annee de construction non trouvee - confirmez ci-dessous.</p>";
          }

          document.getElementById("nbFenetresObserve").value = nbFenetresEstime;
          document.getElementById("etapeTerrain").style.display = "block";
        });
    });
});

document.getElementById("boutonValiderTerrain").addEventListener("click", function() {
  console.log("bouton terrain clique");

  var nbFenetres = parseInt(document.getElementById("nbFenetresObserve").value);
  var anneeFenetres = document.getElementById("anneeFenetres").value;
  var typeEnergie = document.getElementById("typeEnergie").value;

  var anneeNum;
  if (anneeFenetres === "avant1975") anneeNum = 1960;
  else if (anneeFenetres === "1975-1990") anneeNum = 1982;
  else if (anneeFenetres === "1990-2010") anneeNum = 2000;
  else anneeNum = 2015;

  var perte = calculerPerteEnergetique(anneeNum, nbFenetres, typeEnergie);

  resultat.innerHTML = resultat.innerHTML +
    "<hr>" +
    "<h3>Ce que vos fenetres vous coutent</h3>" +
    "<p>Perte actuelle : " + perte.perteActuelle + " kWh/an</p>" +
    "<p>Avec des fenetres neuves vous economiseriez :</p>" +
    "<p><strong>" + perte.economieKwh + " kWh par an</strong></p>" +
    "<p><strong>" + perte.economieEuros + " EUR par an sur votre facture</strong></p>";

  document.getElementById("etapeTerrain").style.display = "none";
  etape2.style.display = "block";
});

boutonContact.addEventListener("click", function() {
  var nom = document.getElementById("nom").value;
  var telephone = document.getElementById("telephone").value;
  var email = document.getElementById("email").value;

  if (nom === "" || telephone === "" || email === "") {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  var lead = {
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
      fetch("/api/send-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(lead)
      });
      etape2.style.display = "none";
      confirmation.style.display = "block";
    } else {
      alert("Une erreur est survenue. Reessayez.");
    }
  });
});

}); // fin window load