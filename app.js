const leads = [
  {
    nom: "Martin Dupont",
    adresse: "12 rue de la Thur, Thann",
    telephone: "06 12 34 56 78",
    estProprietaire: true
  },
  {
    nom: "Sophie Bernard",
    adresse: "8 avenue d'Alsace, Mulhouse",
    telephone: "06 98 76 54 32",
    estProprietaire: false
  }
]

leads.forEach(function(lead) {
  console.log(lead.nom + " - " + lead.adresse)
})