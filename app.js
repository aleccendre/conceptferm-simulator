const bouton = document.getElementById("boutonSimuler")
const champAdresse = document.getElementById("adresse")
const resultat = document.getElementById("resultat")

bouton.addEventListener("click", function() {
  const adresse = champAdresse.value

  if (adresse === "") {
    resultat.textContent = "Veuillez entrer une adresse."
    return
  }

  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`

  fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
  const premier = data.features[0]
  const label = premier.properties.label
  const ville = premier.properties.city
  const codePostal = premier.properties.postcode
  const coords = premier.geometry.coordinates

  resultat.textContent = `
    Adresse : ${label}
    Ville : ${ville} (${codePostal})
    Coordonnées : ${coords[1]}, ${coords[0]}
  `
})
})