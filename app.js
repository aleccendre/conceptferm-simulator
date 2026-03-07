const bouton = document.getElementById("boutonSimuler")
const champAdresse = document.getElementById("adresse")
const champType = document.getElementById("typeLogement")
const resultat = document.getElementById("resultat")
const etape2 = document.getElementById("etape2")
const boutonContact = document.getElementById("boutonContact")
const confirmation = document.getElementById("confirmation")

function estimerTravaux(typeLogement) {
  if (typeLogement === "appartement") {
    return { fenetres: 3, coutMin: 3000, coutMax: 5000 }
  } else if (typeLogement === "maison") {
    return { fenetres: 6, coutMin: 6000, coutMax: 10000 }
  } else if (typeLogement === "maison_grande") {
    return { fenetres: 10, coutMin: 10000, coutMax: 16000 }
  }
}

bouton.addEventListener("click", function() {
  const adresse = champAdresse.value
  const typeLogement = champType.value

  if (adresse === "") {
    resultat.textContent = "Veuillez entrer une adresse."
    return
  }

  if (typeLogement === "") {
    resultat.textContent = "Veuillez choisir un type de logement."
    return
  }

  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`

  fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      const premier = data.features[0]
      const score = premier.properties.score
      const fiabilite = score > 0.8 ? "Adresse trouvée avec précision" : "Adresse approximative"
      const estimation = estimerTravaux(typeLogement)

      resultat.innerHTML = `
        <h2>Résultats pour ${adresse}</h2>
        <p>${fiabilite}</p>
        <p>Nombre de fenêtres estimé : ${estimation.fenetres}</p>
        <p>Estimation travaux : entre ${estimation.coutMin}€ et ${estimation.coutMax}€</p>
      `

      etape2.style.display = "block"
    })
})

boutonContact.addEventListener("click", function() {
  const nom = document.getElementById("nom").value
  const telephone = document.getElementById("telephone").value
  const email = document.getElementById("email").value

  if (nom === "" || telephone === "" || email === "") {
    alert("Veuillez remplir tous les champs.")
    return
  }

  const lead = {
    nom: nom,
    telephone: telephone,
    email: email,
    adresse: champAdresse.value,
    typeLogement: champType.value
  }

  console.log("Nouveau lead :", lead)

  etape2.style.display = "none"
  confirmation.style.display = "block"
})