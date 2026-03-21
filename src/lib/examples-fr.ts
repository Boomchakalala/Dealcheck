import { type DealOutput } from '@/types'

// Exemple 1 (HERO): DocuSign — Renouvellement SaaS E-Signature
export const docusignExampleFr: DealOutput = {
  title: "DocuSign · Business Pro · Renouvellement annuel",
  vendor: "DocuSign",
  category: "SaaS - Signature électronique",
  description: "Plateforme de signature électronique — envois illimités, workflows avancés, SSO & accès API",
  verdict: "Vous payez 15 licences inutilisées sans remise de fidélité après 2 ans en tant que client.",
  verdict_type: "negotiate",
  price_insight: "À €50/utilisateur/mois pour 40 licences, vous dépensez €2 000/mois. Seules 25 sont actives — 15 licences restent inutilisées. En ajustant le nombre et en demandant une remise de fidélité, vous économisez €7 800/an.",
  snapshot: {
    vendor_product: "DocuSign / Business Pro",
    term: "12 mois",
    total_commitment: "€24,000",
    billing_payment: "Annuel, facturé d'avance",
    pricing_model: "Par licence, facturation annuelle",
    deal_type: "Renewal",
    renewal_date: "April 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Envois d'enveloppes illimités inclus",
      "SSO & accès API — bonne intégration entreprise",
      "Support prioritaire et rapports de conformité",
    ],
    whats_concerning: [
      "15 des 40 licences sont inactives — 37 % de gaspillage à €50/licence/mois",
      "Renouvellement automatique avec seulement 30 jours de préavis",
      "Augmentation annuelle jusqu'à 8 % sans plafond",
    ],
    conclusion: "Bon produit, trop de licences. Réduisez à 30 licences, obtenez une remise de fidélité et économisez €7 800/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Vous payez 40 licences mais seulement 25 sont actives — 15 licences inutilisées",
      why_it_matters: "15 licences inutilisées x €50/mois = €750/mois = €9 000/an de gaspillage. En ajustant à 30 licences (25 actives + 5 de marge), le coût passe à €1 500/mois au lieu de €2 000/mois. Soit €500/mois économisés = €6 000/an.",
      what_to_ask_for: "Réduire de 40 à 30 licences — €1 500/mois au lieu de €2 000 (économie de €6 000/an)",
      if_they_push_back: "Réduire à 35 licences — économie de €3 000/an",
    },
    {
      type: "Commercial",
      issue: "Aucune remise de fidélité après 2 ans en tant que client",
      why_it_matters: "Les responsables de comptes DocuSign ont l'autorité d'accorder des remises de 10-15 % au renouvellement pour les clients de plus de 12 mois — surtout lorsqu'un devis concurrent est en jeu. Sur un contrat ajusté à €18 000/an, une remise de 10 % vous fait économiser €1 800/an. Vous ne l'obtenez pas parce que vous ne l'avez pas demandé.",
      what_to_ask_for: "Remise de fidélité de 10 % au renouvellement — économie de €1 800/an sur le contrat ajusté",
      if_they_push_back: "Remise de 5 % — économie de €900/an",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Client depuis 2 ans — fidéliser coûte bien moins cher à DocuSign que d'acquérir un nouveau client",
      "15 licences inutilisées prouvent que vous êtes sur-licencié — ils devraient préférer ajuster plutôt que vous perdre",
      "PandaDoc Business est à ~€35/utilisateur/mois pour des fonctionnalités équivalentes — 30 % moins cher",
      "Vous renouvelez, vous ne résiliez pas — c'est le moment où votre levier est maximal",
    ],

    trades_you_can_offer: [
      "Engagement sur 2 ans en échange d'une remise de 10 % et d'un gel tarifaire",
      "Avis sur G2 ou Capterra",
      "Recommandation d'une entreprise de votre réseau si les conditions sont favorables",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Réduire de 40 à 30 licences — €1 500/mois au lieu de €2 000 (économie de €6 000/an)",
      "Remise de fidélité de 10 % sur le contrat ajusté (économie de €1 800/an)",
    ],
    nice_to_have: [
      "Allonger le préavis de renouvellement automatique de 30 à 60 jours",
      "Gel tarifaire sur 2 ans — supprimer la clause d'augmentation annuelle",
    ],
  },
  potential_savings: {
    conservative_floor: "€6,000",
    optimistic_ceiling: "€7,800",
    floor_label: "If your strongest asks land",
    ceiling_label: "If vendor meets you halfway",
    summary: "Le plancher repose sur l'ajustement des licences seul ; le plafond ajoute une remise de fidélité qui dépend de la négociation.",
    items: [
      {
        ask: "Ajustement de 40 à 30 licences",
        tier: 1,
        conservative_impact: "€6,000 saved",
        optimistic_impact: "€6,000 saved",
        rationale: "15 licences inutilisées — supprimer le gaspillage ne nécessite aucune concession",
      },
      {
        ask: "Remise de fidélité de 10 % sur le contrat ajusté",
        tier: 2,
        conservative_impact: "€0",
        optimistic_impact: "€1,800 saved",
        rationale: "Remise de renouvellement standard — les responsables de comptes DocuSign ont l'autorité pour 10-15 %",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Renouvellement DocuSign",
      body: `Bonjour [Nom],

Merci pour l'avis de renouvellement — nous prévoyons de rester chez DocuSign et souhaitons confirmer rapidement.

Deux points à régler avant de signer :

1. Nombre de licences : nous avons 40 licences mais seulement 25 sont utilisées activement. Je souhaiterais ajuster à 30 — cela nous laisse une marge confortable sans payer 10 licences inutiles. Cela nous ramène à €1 500/mois.

2. Remise de fidélité : nous sommes clients DocuSign depuis 2 ans. PandaDoc et Adobe Sign nous proposent tous deux 10-15 % en dessous de ce tarif. Serait-il possible d'appliquer une remise de fidélité de 10 % au renouvellement ?

Ensemble, cela nous amène à environ €16 200/an — nous sommes prêts à nous engager sur 2 ans et à laisser un avis si cela vous aide.

Dites-moi si nous pouvons boucler cela cette semaine.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Renouvellement DocuSign — suivi",
      body: `Bonjour [Nom],

Nous souhaitons renouveler mais avons besoin de deux ajustements avant de signer :

1. Réduction de 40 à 30 licences — seulement 25 sont actives. Nouveau mensuel : €1 500.
2. Remise de fidélité de 10 % — nous sommes clients depuis 2 ans et PandaDoc propose 30 % en dessous de votre tarif actuel.

Total ajusté : €16 200/an. Nous sommes prêts à nous engager sur 2 ans pour que cela fonctionne de votre côté.

Pouvez-vous confirmer d'ici vendredi ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "DocuSign — conditions de renouvellement",
      body: `Bonjour [Nom],

Nous avons examiné le renouvellement et deux points doivent être résolus avant de pouvoir signer :

1. Nous payons 40 licences avec 25 actives. Nous ne renouvellerons pas à 40 licences.
2. Après 2 ans en tant que client, nous attendons un tarif de fidélité. PandaDoc nous a proposé 30 % en dessous de votre prix actuel.

Nous sommes prêts à nous engager sur 2 ans à 30 licences avec une remise de 10 % — €16 200/an. Si nous ne pouvons pas nous aligner, nous devrons finaliser notre évaluation des alternatives avant le 1er avril.

Merci de répondre avant le [DATE].

Cordialement,
[Votre nom]`,
    },
  },
  score: 51,
  score_label: "À négocier",
  score_breakdown: {
    pricing_fairness: 20,
    terms_protections: 16,
    leverage_position: 15,
    pricing_deductions: [
      { points: 15, reason: "15 licences inutilisées au plein tarif — 37 % de gaspillage" },
      { points: 10, reason: "Aucune remise de fidélité au renouvellement" },
      { points: 5, reason: "Les économies à forte probabilité dépassent 25 % du contrat" },
    ],
    terms_deductions: [
      { points: 8, reason: "Renouvellement automatique avec seulement 30 jours de préavis" },
      { points: 6, reason: "Augmentation annuelle jusqu'à 8 % sans plafond" },
    ],
    leverage_deductions: [
      { points: 5, reason: "Paiement annuel d'avance requis" },
    ],
  },
  score_rationale: "Vous payez 15 licences inutilisées sans remise de fidélité après 2 ans en tant que client",
  assumptions: [
    "25 des 40 licences sont activement utilisées selon les données de dernière connexion",
    "PandaDoc Business à ~€35/utilisateur/mois utilisé comme référence concurrentielle",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel.",
}

// Exemple 2 : Salesforce — Renouvellement CRM annuel
export const salesforceExampleFr: DealOutput = {
  title: "Salesforce · Sales Cloud Professional · Renouvellement annuel",
  vendor: "Salesforce",
  category: "SaaS - CRM",
  description: "Plateforme CRM — gestion du pipeline, prévisions et automatisation commerciale",
  verdict: "Vous payez 12 licences inutilisées au plein tarif sans remise pluriannuelle au renouvellement.",
  verdict_type: "negotiate",
  price_insight: "À €75/utilisateur/mois pour 40 licences, vous dépensez €3 000/mois. Avec seulement 28 utilisateurs actifs, 12 licences restent inutilisées. En réduisant à 32 et en vous engageant sur 2 ans, vous obtenez une remise significative.",
  snapshot: {
    vendor_product: "Salesforce / Sales Cloud Professional",
    term: "12 mois",
    total_commitment: "€36,000",
    billing_payment: "Annuel, payé d'avance",
    pricing_model: "Par licence, facturation annuelle",
    deal_type: "Renewal",
    renewal_date: "June 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "CRM de référence — votre équipe commerciale est formée dessus",
      "Intégration solide avec votre stack marketing et ERP",
      "Disponibilité fiable et sécurité de niveau entreprise",
    ],
    whats_concerning: [
      "12 des 40 licences sont inactives — 30 % de gaspillage à €75/licence/mois",
      "Aucune remise pluriannuelle malgré 3 ans d'ancienneté client",
      "Le renouvellement automatique vous bloque au même nombre de licences et au même tarif",
    ],
    conclusion: "Bon outil, trop de licences. Réduisez de 40 à 32, engagez-vous sur 2 ans pour une remise et économisez €9 500/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Vous payez 40 licences mais seulement 28 sont actives — 12 licences inutilisées",
      why_it_matters: "Chaque licence inutilisée coûte €75/mois. 12 x €75 = €900/mois = €10 800/an de gaspillage. En ajustant à 32 licences (28 actives + 4 de marge), le coût passe à €2 400/mois au lieu de €3 000/mois. Soit €600/mois économisés = €7 200/an.",
      what_to_ask_for: "Réduire de 40 à 32 licences — €2 400/mois au lieu de €3 000 (économie de €7 200/an)",
      if_they_push_back: "Réduire à 36 licences — économie de €3 600/an",
    },
    {
      type: "Commercial",
      issue: "Aucune remise de fidélité pluriannuelle après 3 ans en tant que client",
      why_it_matters: "Les responsables de comptes Salesforce proposent régulièrement des remises de 8-12 % pour les renouvellements pluriannuels, en particulier pour les clients de 3 ans et plus. Sur un contrat ajusté à €28 800/an, une remise de 8 % vous fait économiser €2 304/an.",
      what_to_ask_for: "Remise pluriannuelle de 8 % sur un engagement de 2 ans — économie de €2 304/an",
      if_they_push_back: "Remise de 5 % sur le renouvellement annuel — économie de €1 440/an",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Client depuis 3 ans — l'équipe de fidélisation Salesforce a l'autorité d'accorder des remises",
      "HubSpot Sales Hub et Pipedrive offrent des fonctionnalités comparables à €40-50/utilisateur/mois",
      "12 licences inutilisées sont la preuve documentée d'un sur-licenciement",
      "Vous avez 3 mois avant le renouvellement — assez pour mener une évaluation concurrentielle",
    ],

    trades_you_can_offer: [
      "Engagement de renouvellement sur 2 ans pour une remise et un gel tarifaire",
      "Ajout de 2 licences Service Cloud si le tarif unitaire descend à €70",
      "Participation à une référence client ou étude de cas",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Réduire de 40 à 32 licences — €2 400/mois au lieu de €3 000 (économie de €7 200/an)",
      "Remise de fidélité de 8 % sur un engagement de 2 ans (économie de €2 304/an sur le contrat ajusté)",
    ],
    nice_to_have: [
      "Gel tarifaire sur la durée de l'engagement de 2 ans — aucune augmentation annuelle",
      "Réduire le préavis de renouvellement automatique de 90 à 30 jours",
    ],
  },
  potential_savings: {
    conservative_floor: "€7,200",
    optimistic_ceiling: "€9,504",
    floor_label: "If your strongest asks land",
    ceiling_label: "If vendor meets you halfway",
    summary: "Le plancher repose sur l'ajustement des licences seul ; le plafond ajoute une remise pluriannuelle qui dépend de la négociation.",
    items: [
      {
        ask: "Ajustement de 40 à 32 licences",
        tier: 1,
        conservative_impact: "€7,200 saved",
        optimistic_impact: "€7,200 saved",
        rationale: "12 licences inutilisées — supprimer le gaspillage ne nécessite aucune concession",
      },
      {
        ask: "Remise de fidélité de 8 % sur le contrat ajusté",
        tier: 2,
        conservative_impact: "€0",
        optimistic_impact: "€2,304 saved",
        rationale: "Remise pluriannuelle standard — les responsables Salesforce proposent régulièrement 8-12 %",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Renouvellement Salesforce",
      body: `Bonjour [Nom],

Merci pour le renouvellement — nous prévoyons de rester sur Sales Cloud et souhaitons régler cela avant le 1er juin.

Deux points avant de confirmer :

1. Nombre de licences : nous avons 40 licences mais seulement 28 sont utilisées activement. Je souhaiterais ajuster à 32 — cela nous laisse de la marge sans payer 8 licences inutiles. Cela nous ramène à €2 400/mois.

2. Remise pluriannuelle : nous sommes sur Salesforce depuis 3 ans. HubSpot et Pipedrive proposent tous deux des tarifs nettement inférieurs. Une remise de 8 % serait-elle envisageable si nous nous engageons sur 2 ans ?

Cela nous amène à environ €26 496/an — nous sommes prêts à signer un engagement de 2 ans et à envisager l'ajout de Service Cloud si le tarif unitaire descend à €70.

Dites-moi ce que vous pouvez faire.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Renouvellement Salesforce — suivi",
      body: `Bonjour [Nom],

Nous souhaitons renouveler mais avons besoin de deux ajustements :

1. Réduction de 40 à 32 licences — seulement 28 actives. Nouveau mensuel : €2 400.
2. Remise pluriannuelle de 8 % pour un engagement de 2 ans — nous sommes clients depuis 3 ans et HubSpot propose des tarifs bien inférieurs au vôtre.

Total ajusté : €26 496/an. Nous sommes prêts à nous engager sur 2 ans pour que cela fonctionne.

Pouvez-vous confirmer d'ici la fin de semaine ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Salesforce — conditions de renouvellement",
      body: `Bonjour [Nom],

Nous avons examiné le renouvellement et deux points doivent être résolus avant de signer :

1. Nous payons 40 licences avec 28 actives. Nous ne renouvellerons pas au nombre actuel de licences.
2. Après 3 ans, nous attendons un tarif de fidélité. HubSpot et Pipedrive proposent 40 % en dessous de votre prix actuel.

Nous sommes prêts à nous engager sur 2 ans à 32 licences avec une remise de 8 % — €26 496/an. Si nous ne pouvons pas nous aligner, nous finaliserons notre évaluation HubSpot avant le 1er juin.

Merci de répondre avant le [DATE].

Cordialement,
[Votre nom]`,
    },
  },
  score: 47,
  score_label: "À négocier",
  score_breakdown: {
    pricing_fairness: 17,
    terms_protections: 15,
    leverage_position: 15,
    pricing_deductions: [
      { points: 15, reason: "12 licences inutilisées au plein tarif — 30 % de gaspillage" },
      { points: 10, reason: "Aucune remise pluriannuelle au renouvellement" },
      { points: 8, reason: "Les économies dépassent 26 % de la valeur du contrat" },
    ],
    terms_deductions: [
      { points: 10, reason: "Renouvellement automatique avec 90 jours de préavis" },
      { points: 5, reason: "Augmentation tarifaire soumise à révision annuelle" },
    ],
    leverage_deductions: [
      { points: 5, reason: "Paiement annuel d'avance" },
    ],
  },
  score_rationale: "Vous payez 12 licences inutilisées au plein tarif sans remise pluriannuelle au renouvellement",
  assumptions: [
    "28 des 40 licences sont activement utilisées selon un audit de dernière connexion",
    "Remise pluriannuelle de 8 % basée sur les négociations types de renouvellement Salesforce",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel.",
}

// Exemple 3 : Microsoft 365 — Renouvellement Business Premium
export const microsoft365ExampleFr: DealOutput = {
  title: "Microsoft 365 · Business Premium · Renouvellement annuel",
  vendor: "Microsoft 365",
  category: "SaaS - Productivité",
  description: "Suite de productivité — applications Office, Teams, Exchange, Intune, Defender",
  verdict: "18 licences inactives au plein tarif, aucune remise de prépaiement annuel appliquée.",
  verdict_type: "negotiate",
  price_insight: "À €40/utilisateur/mois pour 60 licences, vous dépensez €2 400/mois. Seules 42 sont actives. En ajustant le nombre et en passant au tarif prépayé, vous économisez €7 488/an.",
  snapshot: {
    vendor_product: "Microsoft 365 / Business Premium",
    term: "12 mois",
    total_commitment: "€28,800",
    billing_payment: "Engagement annuel, facturation mensuelle",
    pricing_model: "Par licence, facturation mensuelle",
    deal_type: "Renewal",
    renewal_date: "May 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Suite Office complète avec applications de bureau et web",
      "Gestion des appareils Intune et sécurité Defender incluses",
      "Azure AD Premium P1 — gestion des identités robuste",
    ],
    whats_concerning: [
      "18 des 60 licences sont inactives — 30 % de gaspillage à €40/licence/mois",
      "Tarif mensuel malgré un engagement annuel — remise de prépaiement non appliquée",
      "Les réductions de licences ne sont possibles qu'au renouvellement",
    ],
    conclusion: "Bon produit, trop de licences, mauvais tarif de facturation. Réduisez à 48 licences et passez au prépaiement pour économiser €7 488/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Vous payez 60 licences mais seulement 42 sont actives — 18 licences inutilisées",
      why_it_matters: "18 licences inutilisées x €40/mois = €720/mois = €8 640/an de gaspillage. En ajustant à 48 licences (42 actives + 6 de marge) = €1 920/mois au lieu de €2 400/mois. Économie : €480/mois = €5 760/an.",
      what_to_ask_for: "Réduire de 60 à 48 licences — économie de €5 760/an",
      if_they_push_back: "Réduire à 54 licences — économie de €2 880/an",
    },
    {
      type: "Commercial",
      issue: "Remise de prépaiement annuel non appliquée — vous payez le tarif mensuel sur un engagement annuel",
      why_it_matters: "Microsoft 365 Business Premium facturé annuellement d'avance se négocie généralement à €36-38/utilisateur/mois via les revendeurs, contre €40 en facturation mensuelle. Sur 48 licences, passer au prépaiement annuel économise €1 728/an.",
      what_to_ask_for: "Tarif prépayé annuel — €37/utilisateur/mois sur 48 licences (économie de €1 728/an)",
      if_they_push_back: "€38/utilisateur/mois — économie de €1 152/an",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Les revendeurs ont de la marge à céder — ce n'est pas un prix direct Microsoft",
      "18 licences inutilisées constituent une preuve solide de sur-licenciement",
      "Google Workspace Business Plus est à €13,20/utilisateur/mois — 67 % moins cher pour les utilisateurs non-avancés",
      "Le prépaiement annuel est la norme — vous êtes déjà en engagement annuel, sans bénéficier de la remise",
    ],

    trades_you_can_offer: [
      "Prépayer l'année complète d'avance pour un meilleur tarif",
      "Consolider toutes les licences Microsoft chez un seul revendeur",
      "S'engager sur 2 ans pour un tarif garanti",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Réduire de 60 à 48 licences — économie de €5 760/an",
      "Passer au tarif prépayé annuel à €37/utilisateur — économie de €1 728/an sur le nombre ajusté",
    ],
    nice_to_have: [
      "Intégrer un pilote Microsoft Copilot pour 10 utilisateurs à tarif réduit",
      "Allonger le préavis de renouvellement automatique de 30 à 60 jours",
    ],
  },
  potential_savings: {
    conservative_floor: "€7,488",
    optimistic_ceiling: "€7,488",
    floor_label: "If your strongest asks land",
    ceiling_label: "If vendor meets you halfway",
    summary: "Les deux demandes sont à forte probabilité — l'ajustement des licences et le tarif prépayé sont standards, donc plancher et plafond s'alignent.",
    items: [
      {
        ask: "Ajustement de 60 à 48 licences",
        tier: 1,
        conservative_impact: "€5,760 saved",
        optimistic_impact: "€5,760 saved",
        rationale: "18 licences inutilisées — gaspillage documenté",
      },
      {
        ask: "Tarif prépayé annuel de €40 à €37/utilisateur",
        tier: 1,
        conservative_impact: "€1,728 saved",
        optimistic_impact: "€1,728 saved",
        rationale: "La marge du revendeur est négociable — le tarif prépayé est standard",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Renouvellement Microsoft 365",
      body: `Bonjour [Nom],

Merci pour l'avis de renouvellement — nous restons sur Business Premium et souhaitons régler cela avant le 1er mai.

Deux points avant de confirmer :

1. Nombre de licences : nous avons 60 licences avec 42 actives. Je souhaiterais ajuster à 48 — cela nous laisse une marge confortable sans payer 12 licences inutiles. Nouveau mensuel : €1 920.

2. Tarif prépayé : nous sommes en engagement annuel mais payons le tarif mensuel. Pouvons-nous passer au tarif prépayé annuel — nous avons vu €37/utilisateur comme tarif standard. Sur 48 licences, cela fait €1 776/mois.

Ensemble, cela nous amène à €21 312/an. Nous sommes prêts à prépayer l'année complète d'avance pour simplifier.

Dites-moi ce que vous pouvez faire.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Renouvellement Microsoft 365 — suivi",
      body: `Bonjour [Nom],

Nous souhaitons renouveler mais avons besoin de deux ajustements :

1. Réduction de 60 à 48 licences — seulement 42 actives. Nouveau mensuel : €1 920.
2. Tarif prépayé annuel à €37/utilisateur — nous sommes en engagement annuel mais payons le tarif mensuel. Ce n'est pas compétitif.

Total ajusté : €21 312/an. Nous sommes prêts à prépayer l'année complète d'avance.

Pouvez-vous confirmer d'ici la fin de semaine ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Microsoft 365 — conditions de renouvellement",
      body: `Bonjour [Nom],

Nous avons examiné le renouvellement et deux points doivent être résolus avant de signer :

1. Nous payons 60 licences avec 42 actives. Nous ne renouvellerons pas à 60.
2. Nous attendons un tarif prépayé annuel à €37/utilisateur — Google Workspace nous propose 67 % en dessous de votre tarif actuel pour les utilisateurs non-avancés.

Nous sommes prêts à prépayer une année complète à 48 licences et €37/utilisateur — €21 312. Si nous ne pouvons pas nous aligner, nous répartirons nos licences entre Microsoft et Google Workspace.

Merci de répondre avant le [DATE].

Cordialement,
[Votre nom]`,
    },
  },
  score: 53,
  score_label: "À négocier",
  score_breakdown: {
    pricing_fairness: 22,
    terms_protections: 17,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "18 licences inutilisées au plein tarif — 30 % de gaspillage" },
      { points: 8, reason: "Remise de prépaiement non appliquée sur l'engagement annuel" },
      { points: 5, reason: "Les économies dépassent 25 % de la valeur du contrat" },
    ],
    terms_deductions: [
      { points: 8, reason: "Réduction de licences uniquement au renouvellement — aucune flexibilité en cours de contrat" },
      { points: 5, reason: "Préavis de renouvellement automatique de 30 jours" },
    ],
    leverage_deductions: [
      { points: 6, reason: "Engagement annuel déjà en place" },
    ],
  },
  score_rationale: "18 licences inactives au plein tarif sans remise de prépaiement appliquée",
  assumptions: [
    "42 des 60 licences sont activement utilisées",
    "Tarif prépayé revendeur de €37/utilisateur basé sur des contrats M365 Business Premium comparables",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel.",
}

// Exemple 4 : FedEx — Contrat annuel de livraison
export const fedexExampleFr: DealOutput = {
  title: "FedEx · Accord de livraison professionnel · Contrat annuel",
  vendor: "FedEx",
  category: "Logistique - Livraison",
  description: "Accord annuel de livraison professionnelle — terrestre, express et livraison résidentielle",
  verdict: "Surcharge carburant non plafonnée, tarif de base au-dessus du marché, et clause d'augmentation GRI sans plafond.",
  verdict_type: "overpay_risk",
  price_insight: "Le tarif de base de $4,20/colis est de $0,60-1,00 au-dessus du marché négocié pour votre volume. Combiné à une surcharge carburant non plafonnée de 20 %, vous surpayez significativement.",
  snapshot: {
    vendor_product: "FedEx / Business Shipping Agreement",
    term: "12 mois",
    total_commitment: "$51,960",
    billing_payment: "Facturation mensuelle",
    pricing_model: "Par colis + surcharge carburant + frais additionnels",
    deal_type: "New",
    currency: "USD",
  },
  quick_read: {
    whats_solid: [
      "Couverture nationale solide et suivi des envois",
      "Compte professionnel avec accord tarifaire personnalisé",
      "L'engagement de volume donne du levier pour négocier",
    ],
    whats_concerning: [
      "Surcharge carburant de 20 % sans plafond — révisée chaque semaine",
      "Tarif de base de $4,20/colis au-dessus du marché négocié ($3,20-3,60)",
      "Augmentation GRI annuelle de 7,9 % sans plafond négocié",
    ],
    conclusion: "Trois vrais problèmes : tarif de base, carburant non plafonné et clause GRI. Tous négociables à votre volume.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Surcharge carburant de 20 % sans plafond — révisée chaque semaine",
      why_it_matters: "Les surcharges carburant du marché pour les comptes FedEx négociés se situent entre 10-14 %. À 20 % sur $4 330 de dépense mensuelle de base, vous payez $866/mois en surcharges. À 12 %, ce serait $520/mois — soit une économie de $346/mois = $4 152/an.",
      what_to_ask_for: "Plafonner la surcharge carburant à 12 %, révision mensuelle et non hebdomadaire",
      if_they_push_back: "Plafond à 15 % avec révision mensuelle",
    },
    {
      type: "Commercial",
      issue: "Tarif de base de $4,20/colis au-dessus du marché négocié pour ce volume",
      why_it_matters: "À 900-1 100 colis/mois, vous avez un vrai levier de volume. Les tarifs négociés comparables FedEx et UPS se situent à $3,20-3,60/colis. À $3,50 en moyenne et 1 000 colis/mois : économie de $700/mois = $8 400/an.",
      what_to_ask_for: "Tarif de base de $4,20 à $3,50 — économie de $700/mois = $8 400/an",
      if_they_push_back: "$3,80/colis — économie de $4 800/an",
    },
    {
      type: "Terms",
      issue: "Augmentation GRI annuelle de 7,9 % sans plafond négocié",
      why_it_matters: "Le GRI standard de FedEx est appliqué chaque janvier. 7,9 % sur $51 960 = $4 105 de plus l'an prochain. Les comptes négociés peuvent plafonner cela à 3-4 %. Sur 3 ans à 7,9 % contre 3,5 %, vous paieriez $18 000+ de plus.",
      what_to_ask_for: "Plafonner le GRI à 3,5 % pour la durée du contrat",
      if_they_push_back: "Plafond ferme à 5 %",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "900-1 100 colis/mois représentent un volume significatif que FedEx veut conserver",
      "UPS propose activement des offres contre FedEx dans cette tranche de volume",
      "La surcharge carburant non plafonnée est indéfendable — ils le savent",
      "L'engagement annuel leur apporte une certitude de revenus — exploitez-le pleinement",
    ],

    trades_you_can_offer: [
      "Augmenter l'engagement de volume minimum à 1 100 colis/mois pour un meilleur tarif de base",
      "Engagement de 2 ans pour un plafond GRI et un gel tarifaire",
      "Consolider tous les envois — pas de répartition multi-transporteurs",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Tarif de base de $4,20 à $3,50/colis",
      "Surcharge carburant plafonnée à 12 %, révision mensuelle",
      "Plafond GRI à 3,5 % pour la durée du contrat",
    ],
    nice_to_have: [
      "Surcharge résidentielle réduite de $4,25 à $3,00",
      "Seuil de remise volume à 1 200 colis/mois",
    ],
  },
  potential_savings: {
    conservative_floor: "$12,552",
    optimistic_ceiling: "$12,552",
    floor_label: "If your strongest asks land",
    ceiling_label: "If vendor meets you halfway",
    summary: "Les deux demandes sont à forte probabilité — le tarif de base et la surcharge carburant sont bien au-dessus des tarifs documentés du marché, donc plancher et plafond s'alignent.",
    items: [
      {
        ask: "Tarif de base de $4,20 à $3,50 (1 000 moy./mois)",
        tier: 1,
        conservative_impact: "$8,400 saved",
        optimistic_impact: "$8,400 saved",
        rationale: "Le tarif négocié du marché est de $3,20-3,60 à ce volume — bien documenté",
      },
      {
        ask: "Surcharge carburant de 20 % à 12 %",
        tier: 1,
        conservative_impact: "$4,152 saved",
        optimistic_impact: "$4,152 saved",
        rationale: "Les surcharges du marché se situent entre 10-14 % — 20 % est au-dessus du marché",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Accord FedEx",
      body: `Bonjour [Nom],

Merci pour la proposition — la couverture et les niveaux de service correspondent à nos volumes. Avant de signer, trois points à régler :

1. Tarif de base : $4,20/colis est au-dessus de ce que des comptes comparables à notre volume obtiennent (fourchette $3,20-3,60). Pourrions-nous nous accorder sur $3,50 ?

2. Surcharge carburant : 20 % sans plafond avec révision hebdomadaire est difficile à budgéter. Nous avons besoin d'un plafond à 12 % avec révision mensuelle.

3. Clause GRI : 7,9 % d'augmentation annuelle est élevé. Pourrions-nous convenir d'un plafond à 3,5 % pour la durée du contrat ?

Nous sommes prêts à nous engager sur 1 100 colis/mois et un contrat de 2 ans si nous nous alignons sur ces points.

Au plaisir de régler cela.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Accord FedEx — suivi",
      body: `Bonjour [Nom],

Nous souhaitons avancer mais avons besoin de trois modifications :

1. Tarif de base à $3,50/colis — $4,20 est au-dessus du marché négocié pour notre volume.
2. Surcharge carburant plafonnée à 12 % avec révision mensuelle — 20 % non plafonné n'est pas acceptable.
3. GRI plafonné à 3,5 % — 7,9 % d'augmentation annuelle est trop agressif.

UPS nous a proposé $3,30/colis avec un plafond carburant de 12 %. Nous préférons FedEx mais avons besoin de conditions compétitives.

Pouvez-vous envoyer des conditions révisées cette semaine ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "FedEx — conditions de l'accord de livraison",
      body: `Bonjour [Nom],

Nous devons finaliser notre accord de livraison cette semaine. Nous choisissons entre FedEx et UPS.

Trois points à résoudre :

1. Tarif de base : $3,50/colis (pas $4,20)
2. Plafond carburant : 12 % (pas 20 % non plafonné)
3. GRI : plafond annuel de 3,5 % (pas 7,9 %)

Nous nous engagerons sur 1 100 colis/mois et un contrat de 2 ans si vous confirmez ces conditions. Cela représente plus de $80 000 de chiffre d'affaires annuel garanti.

Sinon, nous signerons avec UPS d'ici vendredi.

Cordialement,
[Votre nom]`,
    },
  },
  score: 41,
  score_label: "À renégocier fermement",
  score_breakdown: {
    pricing_fairness: 15,
    terms_protections: 12,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "Tarif de base au-dessus du marché négocié pour le volume" },
      { points: 12, reason: "Surcharge carburant de 20 % — le marché est à 10-14 %" },
      { points: 8, reason: "Les économies dépassent 24 % de la valeur du contrat" },
    ],
    terms_deductions: [
      { points: 10, reason: "Surcharge carburant non plafonnée révisée chaque semaine" },
      { points: 5, reason: "GRI de 7,9 % sans plafond" },
      { points: 3, reason: "Renouvellement automatique avec 30 jours de préavis" },
    ],
    leverage_deductions: [
      { points: 4, reason: "Engagement de volume minimum de 900 colis/mois" },
      { points: 2, reason: "Délai de signature créant une pression temporelle" },
    ],
  },
  score_rationale: "3 problèmes tarifaires identifiés — tarif de base au-dessus du marché négocié pour le volume",
  assumptions: [
    "Volume moyen de 1 000 colis/mois utilisé pour le calcul des économies",
    "Références de surcharge carburant basées sur des comptes négociés comparables",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel.",
}

// Exemple 5 : Konica Minolta — Location d'équipement de bureau
export const konicaExampleFr: DealOutput = {
  title: "Konica Minolta · Location d'équipement · Contrat de 36 mois",
  vendor: "Konica Minolta",
  category: "Location d'équipement - Bureau",
  description: "Location d'imprimantes multifonctions — 2x bizhub C360i avec service & consommables",
  verdict: "Tarif de location au-dessus du marché, verrouillage obligatoire des consommables, et aucune flexibilité de sortie sur 3 ans.",
  verdict_type: "overpay_risk",
  price_insight: "€870/mois pour 2 MFP couleur A3/A4 est au-dessus des devis comparables de Ricoh, Canon et Xerox (fourchette €620-720). De plus, le verrouillage obligatoire du toner supprime tout levier tarifaire sur les consommables.",
  snapshot: {
    vendor_product: "Konica Minolta / bizhub C360i (x2)",
    term: "36 mois",
    total_commitment: "€35,370",
    billing_payment: "Location mensuelle + frais de service annuels",
    pricing_model: "Location fixe + dépassement par page",
    deal_type: "New",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Capacité couleur A3/A4 couvrant tous les besoins d'impression du bureau",
      "Service et maintenance inclus pendant 3 ans",
      "Forfait d'impression de 3 000 mono / 500 couleur par appareil/mois",
    ],
    whats_concerning: [
      "Location à €870/mois au-dessus des équipements comparables (fourchette €620-720)",
      "Exclusivité toner obligatoire supprimant tout levier sur les consommables",
      "Aucune résiliation anticipée — bloqué pendant 36 mois sans aucune option de sortie",
    ],
    conclusion: "Trois problèmes : tarif de location, verrouillage toner et absence de clause de sortie. Tous négociables avant la signature.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Location à €870/mois au-dessus du marché pour cette gamme d'équipement",
      why_it_matters: "Des MFP couleur A3/A4 comparables (Ricoh IM C3000, Canon imageRUNNER C3326i, Xerox AltaLink C8035) se louent à €620-720/mois pour 2 unités. Vous payez €150-250/mois au-dessus du marché. À €700/mois : économie de €170/mois = €6 120 sur 3 ans.",
      what_to_ask_for: "Réduire la location mensuelle de €870 à €700 — économie de €6 120 sur 3 ans",
      if_they_push_back: "€780/mois — économie de €3 240 sur 3 ans",
    },
    {
      type: "Terms",
      issue: "Exclusivité toner obligatoire auprès de Konica Minolta — coût masqué récurrent",
      why_it_matters: "Les clauses d'approvisionnement exclusif suppriment tout levier tarifaire sur les consommables. Les toners compatibles tiers coûtent 25-35 % moins cher. Sur une dépense toner estimée à €1 200/an, vous payez €300-420/an au-dessus du marché ouvert — soit €900-1 260 sur 3 ans.",
      what_to_ask_for: "Supprimer la clause d'exclusivité toner, ou fixer les prix du toner pour les 36 mois au tarif actuel",
      if_they_push_back: "Autoriser le toner tiers pour les cartouches mono uniquement",
    },
    {
      type: "Terms",
      issue: "Aucune résiliation anticipée — bloqué pendant 36 mois sans aucune option de sortie",
      why_it_matters: "3 ans sans sortie possible est risqué. Les besoins d'impression d'une entreprise évoluent. Les locations d'équipement standard incluent une clause de sortie après 18-24 mois avec des frais de rachat raisonnables.",
      what_to_ask_for: "Option de sortie anticipée à 18 mois avec clause de rachat de 3 mois",
      if_they_push_back: "Clause de sortie à 24 mois avec frais de 3 mois",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Ricoh, Canon et Xerox sont tous en compétition active pour des contrats de cette taille",
      "Vous n'avez pas encore signé — c'est le moment de levier maximal",
      "L'absence de clause de sortie est déséquilibrée et facile à contester",
      "La clause d'exclusivité des consommables est inhabituelle — tout concurrent proposera un approvisionnement ouvert",
    ],

    trades_you_can_offer: [
      "S'engager sur la durée complète de 3 ans d'emblée si la location descend à €700",
      "Acheter l'extension de garantie si l'exclusivité toner est supprimée",
      "Fournir une référence pour leur pipeline commercial B2B",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Location mensuelle de €870 à €700",
      "Supprimer la clause d'exclusivité toner ou verrouiller le prix du toner pour 36 mois",
      "Sortie anticipée à 18 mois avec clause de rachat de 3 mois",
    ],
    nice_to_have: [
      "Réduire le préavis de renouvellement automatique de 90 à 30 jours",
      "Inclure les frais de service annuels dans le mensuel — simplifier la facturation",
    ],
  },
  potential_savings: {
    conservative_floor: "€2,040",
    optimistic_ceiling: "€2,400",
    floor_label: "If your strongest asks land",
    ceiling_label: "If vendor meets you halfway",
    summary: "Le plancher repose sur la réduction du tarif de location seul ; le plafond ajoute les économies toner qui dépendent de la suppression de la clause d'exclusivité.",
    items: [
      {
        ask: "Tarif de location de €870 à €700/mois",
        tier: 1,
        conservative_impact: "€2,040 saved",
        optimistic_impact: "€2,040 saved",
        rationale: "Ricoh, Canon, Xerox proposent tous €620-720 pour des appareils équivalents",
      },
      {
        ask: "Économie toner marché ouvert (est.)",
        tier: 2,
        conservative_impact: "€0",
        optimistic_impact: "€360 saved",
        rationale: "Les toners tiers coûtent 25-35 % moins cher — dépend de la suppression de la clause",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Location Konica Minolta",
      body: `Bonjour [Nom],

Merci pour la proposition — les spécifications correspondent à nos volumes d'impression. Avant de nous engager sur 36 mois, trois points à aborder :

1. Tarif de location mensuel : à €870/mois, nous sommes au-dessus des devis comparables de Ricoh et Canon (fourchette €650-720 pour des appareils équivalents). Serait-il possible de descendre à €700 ?

2. Exclusivité toner : nous aurions besoin que la clause d'approvisionnement exclusif soit supprimée, ou que les prix du toner soient fixés aux tarifs actuels pour les 36 mois.

3. Sortie anticipée : un engagement de 36 mois sans option de sortie est difficile à accepter. Une clause de sortie à 18 mois avec des frais de rachat de 3 mois rendrait cela acceptable.

Nous sommes prêts à confirmer le contrat complet de 3 ans et à ajouter l'extension de garantie si nous nous alignons sur ces points.

Au plaisir de régler cela.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Location Konica Minolta — suivi",
      body: `Bonjour [Nom],

Nous souhaitons avancer mais avons besoin de trois modifications avant de signer :

1. Tarif de location à €700/mois — €870 est au-dessus du marché. Ricoh et Canon proposent €650-720.
2. Exclusivité toner supprimée ou tarif verrouillé pour 36 mois.
3. Clause de sortie à 18 mois avec rachat de 3 mois — 36 mois sans sortie n'est pas acceptable.

Nous nous engagerons sur le contrat complet de 3 ans à €700/mois. Pouvez-vous confirmer ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Konica Minolta — conditions de location",
      body: `Bonjour [Nom],

Nous devons finaliser notre location d'imprimantes cette semaine. Nous choisissons entre Konica Minolta et Ricoh.

Trois points à résoudre :

1. Location : €700/mois (pas €870)
2. Toner : approvisionnement ouvert ou tarif verrouillé
3. Clause de sortie : option de sortie à 18 mois

Nous signerons immédiatement le contrat complet de 3 ans si ces points sont confirmés. Cela représente plus de €25 200 de revenus de location garantis.

Sinon, nous irons chez Ricoh d'ici vendredi.

Cordialement,
[Votre nom]`,
    },
  },
  score: 42,
  score_label: "À renégocier fermement",
  score_breakdown: {
    pricing_fairness: 18,
    terms_protections: 10,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "Tarif de location au-dessus des équipements comparables" },
      { points: 10, reason: "Exclusivité toner obligatoire — coût masqué récurrent" },
      { points: 7, reason: "Les économies dépassent 20 % de la valeur du contrat" },
    ],
    terms_deductions: [
      { points: 12, reason: "Aucune résiliation anticipée — bloqué 36 mois" },
      { points: 5, reason: "Piège du renouvellement automatique à 90 jours de préavis" },
      { points: 3, reason: "Clause d'exclusivité des consommables" },
    ],
    leverage_deductions: [
      { points: 4, reason: "Durée d'engagement de 36 mois" },
      { points: 2, reason: "Délai de signature de 5 jours" },
    ],
  },
  score_rationale: "Tarif de location au-dessus du marché avec verrouillage toner obligatoire et absence de clause de sortie",
  assumptions: [
    "Tarifs de location comparables basés sur les devis Ricoh, Canon et Xerox pour des MFP couleur A3/A4 équivalents",
    "Estimation des économies toner basée sur un différentiel de prix tiers de 25-35 %",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel.",
}

// Exemple 6 : BDO — Services comptables annuels
export const bdoExampleFr: DealOutput = {
  title: "BDO · Services comptables annuels · Forfait",
  vendor: "BDO",
  category: "Services professionnels - Comptabilité",
  description: "Forfait comptabilité & fiscalité PME — comptes de gestion, TVA, paie, déclarations fiscales",
  verdict: "Taux horaire au-dessus du marché, exposition illimitée sur le hors-périmètre, et clause d'augmentation annuelle agressive de 12 %.",
  verdict_type: "negotiate",
  price_insight: "Le forfait est correct, mais le taux de €210/heure pour le hors-périmètre est bien au-dessus du marché (€130-160 en général). Combiné à l'absence de plafond d'heures et à une clause d'augmentation de 12 %, votre exposition financière est mal maîtrisée.",
  snapshot: {
    vendor_product: "BDO / Forfait comptabilité & fiscalité PME",
    term: "12 mois",
    total_commitment: "€24,150",
    billing_payment: "Forfait mensuel + hors-périmètre à l'heure",
    pricing_model: "Forfait fixe (€1,400/mois) + €210/heure hors-périmètre",
    deal_type: "New",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Périmètre complet — comptes de gestion, TVA, fiscalité, paie tout inclus",
      "Responsable de compte senior dédié",
      "Durée minimale de 6 mois — pas un verrouillage excessif",
    ],
    whats_concerning: [
      "Taux hors-périmètre de €210/heure significativement au-dessus du marché (€130-160)",
      "Aucun plafond sur les heures hors-périmètre — exposition financière illimitée",
      "Plafond d'augmentation annuelle de 12 % — bien au-dessus de l'IPC",
    ],
    conclusion: "Bon périmètre, mauvais taux horaire et mauvais contrôle des coûts. Corrigez le taux, plafonnez les heures et limitez l'augmentation annuelle.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Taux hors-périmètre de €210/heure significativement au-dessus du marché",
      why_it_matters: "Les taux hors-périmètre en comptabilité PME mid-market se situent généralement entre €130-160/heure. À 35 heures/an (estimation médiane), €210 coûte €7 350 contre €5 250 à €150 — soit €2 100/an au-dessus du marché.",
      what_to_ask_for: "Réduire le taux horaire de €210 à €150",
      if_they_push_back: "€175/heure",
    },
    {
      type: "Terms",
      issue: "Aucun plafond sur les heures hors-périmètre — exposition financière illimitée",
      why_it_matters: "25-45 heures est une estimation, pas une limite. Une clôture annuelle complexe ou un contrôle fiscal pourrait faire exploser votre facture de plusieurs milliers d'euros sans plafond.",
      what_to_ask_for: "Plafond annuel ferme de 35 heures, approbation préalable requise au-delà de 10 heures/mois",
      if_they_push_back: "Plafond mensuel hors-périmètre de €600 avec approbation requise au-delà",
    },
    {
      type: "Commercial",
      issue: "Plafond d'augmentation annuelle de 12 % bien au-dessus du marché",
      why_it_matters: "12 % sur un forfait annuel de €16 800 = €2 016 de plus l'an prochain. La norme en services professionnels est de 3-5 % indexé sur l'IPC. Sur 3 ans à 12 % contre 3 %, vous paieriez plus de €7 500 de plus.",
      what_to_ask_for: "Augmentation annuelle plafonnée à 3 % ou IPC, le plus bas des deux",
      if_they_push_back: "Plafond ferme de 5 %",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "La comptabilité mid-market est un marché concurrentiel — Grant Thornton, Mazars et les indépendants proposent tous €1 100-1 250/mois",
      "L'absence de plafond d'heures est un signal d'alerte évident — ils sauront que vous avez fait vos recherches",
      "La clause d'augmentation de 12 % est agressive et facile à contester",
      "Vous êtes une entreprise en croissance — ils veulent la relation à long terme",
    ],

    trades_you_can_offer: [
      "Engagement de 2 ans pour un gel tarifaire et un taux horaire réduit",
      "Recommandation d'un contact professionnel de votre réseau",
      "Témoignage ou étude de cas pour leur site web",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Taux horaire de €210 à €150",
      "Plafond annuel ferme de 35 heures avec approbation préalable au-delà de 10 heures/mois",
      "Plafond d'augmentation annuelle de 12 % à 3 %",
    ],
    nice_to_have: [
      "Étendre la couverture paie de 15 à 20 employés",
      "Réduire le préavis de résiliation de 60 à 30 jours",
    ],
  },
  potential_savings: {
    conservative_floor: "€3,612",
    optimistic_ceiling: "€5,112",
    floor_label: "If your strongest asks land",
    ceiling_label: "If vendor meets you halfway",
    summary: "Le plancher couvre les réductions du taux horaire et de l'augmentation annuelle ; le plafond ajoute l'atténuation du risque lié au plafonnement des heures qui dépend de la négociation.",
    items: [
      {
        ask: "Taux horaire de €210 à €150 (35h/an)",
        tier: 1,
        conservative_impact: "€2,100 saved",
        optimistic_impact: "€2,100 saved",
        rationale: "Le taux du marché est de €130-160/heure — €210 est bien au-dessus de la norme",
      },
      {
        ask: "Augmentation annuelle de 12 % à 3 % (économie année 2)",
        tier: 1,
        conservative_impact: "€1,512 saved",
        optimistic_impact: "€1,512 saved",
        rationale: "3-5 % indexé sur l'IPC est la norme du secteur — 12 % est indéfendable",
      },
      {
        ask: "Plafonnement des heures — atténuation du risque (est.)",
        tier: 2,
        conservative_impact: "€0",
        optimistic_impact: "€1,500 saved",
        rationale: "Empêche la facturation illimitée les années complexes — dépend de la négociation du plafond",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Proposition BDO",
      body: `Bonjour [Nom],

Merci pour cette proposition — le périmètre couvre nos besoins et nous souhaitons avancer. Avant de signer, trois points à aborder :

1. Taux horaire : €210/heure est au-dessus de la fourchette de €140-160 que nous avons observée chez des cabinets comparables pour le travail hors-périmètre. Serait-il possible de descendre à €150 ?

2. Plafond d'heures : nous aurions besoin d'un plafond annuel ferme de 35 heures sur le hors-périmètre, avec approbation préalable requise au-delà de 10 heures dans un mois donné. La facturation sans limite n'est pas quelque chose que nous pouvons accepter.

3. Augmentation annuelle : 12 % est élevé — nous aimerions nous accorder sur 3 % ou l'IPC, le plus bas des deux.

Nous sommes prêts à nous engager sur 2 ans si nous trouvons un accord sur ces points — cela facilite la planification des deux côtés.

Au plaisir de travailler ensemble.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Proposition BDO — suivi",
      body: `Bonjour [Nom],

Nous souhaitons avancer mais avons besoin de trois modifications :

1. Taux horaire à €150 — €210 est au-dessus du marché (les cabinets comparables proposent €130-160).
2. Plafond annuel ferme de 35 heures avec approbation mensuelle au-delà de 10 heures.
3. Augmentation annuelle plafonnée à 3 % ou IPC — 12 % n'est pas acceptable.

Grant Thornton et Mazars ont tous deux proposé des forfaits inférieurs au vôtre avec des taux horaires plus bas. Nous préférons BDO mais avons besoin de conditions compétitives.

Pouvez-vous envoyer des conditions révisées cette semaine ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "BDO — conditions de la proposition",
      body: `Bonjour [Nom],

Nous devons finaliser notre arrangement comptable cette semaine. Nous choisissons entre BDO et deux autres cabinets.

Trois points à résoudre :

1. Taux horaire : €150 (pas €210)
2. Plafond d'heures : 35 annuel avec approbation mensuelle
3. Augmentation annuelle : 3 % (pas 12 %)

Nous nous engagerons immédiatement sur une mission de 2 ans si ces points sont confirmés.

Sinon, nous irons chez Mazars d'ici la fin du mois.

Cordialement,
[Votre nom]`,
    },
  },
  score: 46,
  score_label: "À négocier",
  score_breakdown: {
    pricing_fairness: 20,
    terms_protections: 12,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "Taux hors-périmètre de €210/heure au-dessus du marché (€130-160)" },
      { points: 8, reason: "Augmentation annuelle de 12 % bien au-dessus de l'IPC" },
      { points: 7, reason: "Les économies dépassent 20 % de la valeur estimée du contrat" },
    ],
    terms_deductions: [
      { points: 10, reason: "Aucun plafond sur les heures hors-périmètre — exposition illimitée" },
      { points: 5, reason: "Facturation immédiate dès changement de périmètre" },
      { points: 3, reason: "Préavis de résiliation de 60 jours" },
    ],
    leverage_deductions: [
      { points: 6, reason: "Services professionnels — coût de changement modéré" },
    ],
  },
  score_rationale: "Taux hors-périmètre de €210/heure au-dessus du marché sans plafond d'heures",
  assumptions: [
    "35 heures/an utilisées comme estimation médiane pour le travail hors-périmètre",
    "Taux horaires du marché basés sur des cabinets mid-market comparables (Grant Thornton, Mazars)",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel.",
}

export const examplesFr = {
  docusign: docusignExampleFr,
  salesforce: salesforceExampleFr,
  microsoft365: microsoft365ExampleFr,
  fedex: fedexExampleFr,
  konica: konicaExampleFr,
  bdo: bdoExampleFr,
}

export type ExampleType = keyof typeof examplesFr
