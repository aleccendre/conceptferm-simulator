const bouton = document.getElementById("boutonSimuler")
const champAdresse = document.getElementById("adresse")
const resultat = document.getElementById("resultat")

function analyserAdresse(adresse) {
  if (adresse === "") {
    return "Veuillez entrer une adresse."
  }
  return `Analyse en cours pour : ${adresse}`
}

bouton.addEventListener("click", function() {
  const adresse = champAdresse.value
  const message = analyserAdresse(adresse)
  resultat.textContent = message
})