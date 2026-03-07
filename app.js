function analyserLead(lead) {
  console.log("--- Analyse du lead ---")
  console.log(`Nom : ${lead.nom}`)
  console.log(`Adresse :  ${lead.adresse}`)

  if (!lead.estProprietaire) {
    console.log("Non éligible aux aides - locataire")
    return
  }

  if (lead.revenuFiscal < 15000) {
    console.log("Taux MPR : 50%")
  } else if (lead.revenuFiscal < 30000) {
    console.log("Taux MPR : 40%")
  } else if (lead.revenuFiscal < 45000) {
    console.log("Taux MPR : 30%")
  } else {
    console.log("Taux MPR : 15%")
  }
}

const leads = [
  { nom: "Martin Dupont", adresse: "12 rue de la Thur, Thann", estProprietaire: true, revenuFiscal: 25000 },
  { nom: "Sophie Bernard", adresse: "8 avenue d'Alsace, Mulhouse", estProprietaire: false, revenuFiscal: 18000 },
  { nom: "Pierre Martin", adresse: "3 rue de Cernay, Mulhouse", estProprietaire: true, revenuFiscal: 12000 }
]

leads.forEach(function(lead) {
  analyserLead(lead)
})