import { type DealOutput } from '@/types'

// Exemple 1 : Agence Marketing — calcul clair, grosses économies
export const marketingAgencyExampleFr: DealOutput = {
  title: "Mandat Agence Marketing - Brightwave - Contrat 12 mois",
  vendor: "Brightwave Marketing",
  category: "Services Marketing",
  description: "Agence de marketing digital complète — SEO, contenu, publicité payante",
  verdict: "Vous surpayez les frais de gestion publicitaire et il manque des protections essentielles. Deux demandes pourraient vous faire économiser 16 800 €/an.",
  verdict_type: "negotiate",
  price_insight: "Le mandat est à 7 500 €/mois, mais des agences comparables facturent entre 6 000 et 6 500 €. Combiné à des frais de gestion publicitaire gonflés à 20 %, vous laissez 16 800 €/an sur la table.",
  snapshot: {
    vendor_product: "Brightwave Marketing / Mandat complet",
    term: "12 mois",
    total_commitment: "111 600 €",
    billing_payment: "Mensuel 9 300 € (7 500 € mandat + 1 800 € gestion publicitaire)",
    pricing_model: "Mandat fixe + 20 % des dépenses publicitaires en frais de gestion",
    deal_type: "New",
  },
  quick_read: {
    whats_solid: [
      "Gestionnaire de compte dédié et rapports mensuels inclus",
      "Couvre le SEO, le marketing de contenu, les réseaux sociaux et la publicité payante",
      "Études de cas solides en B2B SaaS — expérience pertinente",
    ],
    whats_concerning: [
      "Frais de gestion publicitaire de 20 % — la norme du secteur est de 10 à 15 %",
      "Mandat de 7 500 €/mois au-dessus du marché pour ce périmètre (6 000 à 6 500 € typique)",
      "Aucun livrable minimum — « jusqu'à 8 articles de blog » pourrait signifier 2",
    ],
    conclusion: "Bonne agence, contrat trop cher. Négociez le mandat à la baisse et divisez les frais publicitaires par deux pour économiser 16 800 €/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Frais de gestion publicitaire de 20 % — le double de la norme du secteur",
      why_it_matters: "Vous dépensez 9 000 €/mois en publicité. À 20 %, cela représente 1 800 €/mois en frais de gestion. La norme du secteur est de 10 %, soit 900 €/mois. Vous surpayez de 900 €/mois = 10 800 €/an.",
      what_to_ask_for: "Réduire les frais de gestion publicitaire de 20 % à 10 %. Économie de 900 €/mois = 10 800 €/an.",
      if_they_push_back: "Accepter 15 % (1 350 €/mois) — économie tout de même de 450 €/mois = 5 400 €/an.",
    },
    {
      type: "Commercial",
      issue: "Mandat à 7 500 €/mois — au-dessus du prix du marché",
      why_it_matters: "Des agences comparables avec ce périmètre facturent généralement entre 6 000 et 6 500 €/mois. À 7 500 €, vous payez 1 000 à 1 500 €/mois au-dessus du marché. Soit 12 000 à 18 000 €/an en trop.",
      what_to_ask_for: "Réduire le mandat de 7 500 € à 6 500 €/mois. Économie de 1 000 €/mois = 12 000 €/an. Reste au-dessus du bas de la fourchette du marché.",
      if_they_push_back: "Accepter 7 000 €/mois (économie de 6 000 €/an) en échange d'une étude de cas après 6 mois.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Vous êtes un nouveau client — ils veulent décrocher le contrat",
      "Un engagement de 12 mois vous donne un pouvoir de négociation",
      "Vous avez des devis concurrents de 2 autres agences à 6 000-6 500 €/mois",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Prolonger à 18 mois s'ils réduisent les frais publicitaires à 10 %",
      "Fournir un témoignage et une étude de cas après 6 mois",
      "Recommander 2 entreprises de votre réseau si les conditions sont satisfaisantes",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Réduire les frais de gestion publicitaire de 20 % à 10 % (économie de 10 800 €/an)",
      "Réduire le mandat de 7 500 € à 7 000 €/mois (économie de 6 000 €/an — compromis raisonnable)",
      "Ajouter des livrables minimums : 6 articles de blog/mois, 2 sessions stratégiques, rapports mensuels",
    ],
    nice_to_have: [
      "Clause de résiliation à 30 jours au lieu de 60",
      "Revue de performance trimestrielle avec option de renégociation si les objectifs ne sont pas atteints",
    ],
  },
  potential_savings: [
    {
      ask: "Réduire les frais publicitaires de 20 % à 10 %",
      annual_impact: "10 800 € économisés",
    },
    {
      ask: "Réduire le mandat de 7 500 € à 7 000 €/mois",
      annual_impact: "6 000 € économisés",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Proposition Brightwave — Quelques questions avant signature",
      body: `Bonjour [Nom],

Merci pour la proposition — nous sommes enthousiastes à l'idée de travailler avec Brightwave.

Avant de signer, deux points que j'aimerais clarifier :

1. Frais de gestion publicitaire : Les frais de 20 % sur nos 9 000 €/mois de dépenses publicitaires représentent 1 800 €/mois. La norme du secteur se situe entre 10 et 15 % — serait-il possible de passer à 10 % ?

2. Mandat : À 7 500 €/mois, nous sommes un peu au-dessus de ce que d'autres agences nous ont proposé (6 000-6 500 €). Un mandat à 7 000 €/mois serait-il envisageable avec un engagement de 12 mois ?

Ces deux ajustements représenteraient une économie d'environ 16 800 €/an et rendraient la décision évidente de notre côté.

Je suis disponible pour un appel cette semaine.

Cordialement,
[Votre Nom]`,
    },
    firm: {
      subject: "Proposition Brightwave — Révisions nécessaires pour avancer",
      body: `Bonjour [Nom],

Nous avons examiné la proposition et deux ajustements sont indispensables pour avancer :

1. Frais de gestion publicitaire : 20 %, c'est au-dessus du marché. Nous avons besoin de 10 % (900 €/mois au lieu de 1 800 €). C'est un écart de 10 800 €/an que nous ne pouvons pas justifier en interne.

2. Mandat : Nous avons besoin de 7 000 €/mois, pas 7 500 €. D'autres agences nous ont proposé 6 000 à 6 500 € pour un périmètre comparable.

Combinés, ces changements font passer le contrat de 111 600 € à 94 800 €/an — c'est le niveau nécessaire pour obtenir la validation budgétaire.

Nous sommes prêts à signer un contrat de 12 mois cette semaine si nous trouvons un accord sur ces chiffres.

Cordialement,
[Votre Nom]`,
    },
    final_push: {
      subject: "Décision finale — Brightwave Marketing",
      body: `Bonjour [Nom],

Nous devons finaliser notre choix d'agence d'ici vendredi. Nous hésitons entre Brightwave et une autre agence.

Nous préférons travailler avec vous — vos études de cas sont plus convaincantes. Mais les chiffres doivent fonctionner :

- Frais publicitaires : 10 % (et non 20 %) — économie de 10 800 €/an
- Mandat : 7 000 €/mois (et non 7 500 €) — économie de 6 000 €/an

Si vous confirmez ces conditions, nous signons un contrat de 18 mois immédiatement. C'est un revenu garanti de 94 800 € sur 18 mois contre 111 600 € sur 12 mois au tarif actuel.

Sinon, nous irons avec l'Agence B à 72 000 €/an.

Pouvez-vous revenir vers nous d'ici jeudi ?

Cordialement,
[Votre Nom]`,
    },
  },
  assumptions: [
    "Dépenses publicitaires mensuelles de 9 000 € utilisées pour calculer les économies sur les frais de gestion",
    "Prix du marché pour des agences comparables basé sur 3 devis concurrentiels à 6 000-6 500 €/mois",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel. Vérifiez toutes les informations de manière indépendante et consultez des conseillers agréés avant de prendre des décisions d'approvisionnement.",
}

// Exemple 2 : CRM SaaS — Salesforce, négociation réaliste de licences
// Arithmétique :
//   Contrat actuel : 40 licences × 75 €/utilisateur/mois = 3 000 €/mois = 36 000 €/an
//   Utilisation réelle : 28 utilisateurs actifs — 12 licences inutilisées (30 % de gaspillage)
//   Redimensionnement à 32 licences : 32 × 75 € = 2 400 €/mois = 28 800 €/an
//   Économie licences : 36 000 € − 28 800 € = 7 200 €/an
//   Remise engagement 2 ans (~8 %) : 8 % × 28 800 € = 2 304 €
//   Coût annuel après remise : 28 800 € − 2 304 € = 26 496 €/an
//   Économie totale : 36 000 € − 26 496 € = 9 504 €/an (~26 %)
export const saasEmailExampleFr: DealOutput = {
  title: "Salesforce Sales Cloud · Professional · Renouvellement annuel",
  vendor: "Salesforce",
  category: "SaaS - CRM",
  description: "Plateforme CRM — gestion de pipeline, prévisions et automatisation commerciale",
  verdict: "Vous payez pour 40 licences mais seules 28 sont actives. Redimensionner à 32 licences et s'engager sur 2 ans permet d'économiser 9 500 €/an — une réduction de 26 %.",
  verdict_type: "negotiate",
  price_insight: "À 75 €/utilisateur/mois pour 40 licences, vous dépensez 3 000 €/mois. Avec seulement 28 utilisateurs actifs, 12 licences sont inutilisées. Passer à 32 licences (avec une marge) et s'engager sur 2 ans vous donne une remise significative.",
  snapshot: {
    vendor_product: "Salesforce / Sales Cloud Professional",
    term: "12 mois",
    total_commitment: "36 000 €",
    billing_payment: "Annuel 36 000 € (40 licences × 75 €/utilisateur/mois)",
    pricing_model: "Par licence, facturation annuelle",
    deal_type: "Renewal",
    renewal_date: "1er juin 2026",
  },
  quick_read: {
    whats_solid: [
      "CRM de référence — votre équipe commerciale est formée dessus",
      "Intégrations solides avec votre stack marketing et votre ERP",
      "Disponibilité fiable et sécurité de niveau entreprise",
    ],
    whats_concerning: [
      "12 des 40 licences sont inactives — 30 % de gaspillage à 75 €/licence/mois",
      "Aucune remise multi-annuelle malgré 3 ans d'ancienneté client",
      "Le renouvellement automatique vous bloque au même nombre de licences et au même tarif",
    ],
    conclusion: "Bon outil, trop de licences. Passez de 40 à 32, engagez-vous sur 2 ans pour une remise, et économisez 9 500 €/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Vous payez pour 40 licences mais seules 28 sont actives — 12 inutilisées",
      why_it_matters: "Chaque licence inutilisée coûte 75 €/mois. Soit 12 × 75 € = 900 €/mois = 10 800 €/an de gaspillage. Même en gardant une marge de 4 licences supplémentaires (32 au total), vous économiseriez 600 €/mois = 7 200 €/an.",
      what_to_ask_for: "Réduire de 40 à 32 licences. Économie de 600 €/mois = 7 200 €/an. Vous gardez 4 licences de marge au-delà de vos 28 utilisateurs actifs, et pouvez en ajouter à tout moment.",
      if_they_push_back: "Accepter 35 licences (économie de 375 €/mois = 4 500 €/an). Ça supprime déjà le gaspillage pur.",
    },
    {
      type: "Commercial",
      issue: "Aucune remise de fidélité après 3 ans en tant que client",
      why_it_matters: "Salesforce propose régulièrement 8 à 12 % de remise pour les engagements pluriannuels, surtout pour les renouvellements. Sur 32 licences à 28 800 €/an, une remise de 8 % représente 2 304 €/an d'économies. Vous ne l'obtenez pas parce que vous n'avez pas demandé.",
      what_to_ask_for: "S'engager sur un renouvellement de 2 ans à 8 % de remise. Sur 32 licences (28 800 €/an), cela représente 2 304 €/an d'économies. Combiné au redimensionnement, économie totale = 9 504 €/an par rapport au contrat actuel de 36 000 €.",
      if_they_push_back: "Accepter 5 % de remise (1 440 €/an d'économies) pour un engagement de 2 ans. Ça reste intéressant pour la stabilité tarifaire.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Client depuis 3 ans — les équipes de fidélisation Salesforce ont le pouvoir de consentir des remises sur les renouvellements",
      "HubSpot CRM et Pipedrive proposent des fonctionnalités comparables à 40–50 €/utilisateur/mois",
      "Vous avez 2 mois avant le renouvellement — suffisant pour mener une évaluation concurrentielle",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "S'engager sur 2 ans en échange d'une remise de 8 % et d'un gel des prix",
      "Ajouter 2 licences Service Cloud (revenus supplémentaires pour Salesforce) si le tarif par licence passe à 70 €",
      "Participer à un programme de témoignage client ou une étude de cas",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Réduire de 40 à 32 licences — 2 400 €/mois au lieu de 3 000 € (économie de 7 200 €/an)",
      "Engagement 2 ans avec 8 % de remise — 26 496 €/an au lieu de 28 800 € (économie supplémentaire de 2 304 €)",
    ],
    nice_to_have: [
      "Gel des prix pour toute la durée de l'engagement de 2 ans",
      "5 heures de formation admin gratuite pour vos nouvelles recrues commerciales",
    ],
  },
  potential_savings: [
    {
      ask: "Redimensionner de 40 à 32 licences",
      annual_impact: "7 200 € économisés",
    },
    {
      ask: "Remise engagement 2 ans (8 %)",
      annual_impact: "2 304 € économisés",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Renouvellement Salesforce — Ajustement du nombre de licences",
      body: `Bonjour [Nom],

Merci pour l'avis de renouvellement. Nous souhaitons continuer avec Salesforce — l'équipe l'utilise quotidiennement.

Avant de signer, j'aimerais ajuster notre nombre de licences. Nous avons actuellement 40 licences mais seules 28 sont en utilisation active. Nous aimerions renouveler à 32 licences (2 400 €/mois) pour garder une marge tout en supprimant le gaspillage.

Nous aimerions également discuter d'un engagement sur 2 ans en échange d'une remise de fidélité. Nous sommes clients Salesforce depuis 3 ans et souhaitons poursuivre à long terme avec des tarifs qui reflètent cette ancienneté.

Pourriez-vous nous envoyer des conditions révisées pour 32 licences avec une option 2 ans ?

Cordialement,
[Votre Nom]`,
    },
    firm: {
      subject: "Renouvellement Salesforce — Conditions à revoir",
      body: `Bonjour [Nom],

Nous examinons notre renouvellement Salesforce et deux ajustements sont nécessaires avant de poursuivre :

1. Licences : Nous payons pour 40 mais n'en utilisons que 28. Nous devons passer à 32. Soit 7 200 €/an d'économies.

2. Tarifs : Après 3 ans en tant que client, nous attendons une remise pluriannuelle. Une réduction de 8 % sur un engagement de 2 ans est la norme — soit 2 304 €/an.

Combinés, ces ajustements font passer notre contrat de 36 000 € à environ 26 500 €/an. C'est cohérent avec ce que HubSpot et Pipedrive nous ont proposé (40 à 50 €/utilisateur pour des fonctionnalités similaires).

Nous voulons rester sur Salesforce, mais uniquement à un tarif qui reflète notre utilisation réelle et notre fidélité.

Pouvez-vous nous envoyer des conditions révisées cette semaine ?

Cordialement,
[Votre Nom]`,
    },
    final_push: {
      subject: "Renouvellement Salesforce — Date limite de décision",
      body: `Bonjour [Nom],

Notre date limite de renouvellement est dans 2 semaines et nous devons trancher.

Nous avons évalué HubSpot CRM (45 €/utilisateur/mois) en parallèle de Salesforce. Pour 32 utilisateurs, cela représente 17 280 €/an contre nos 36 000 € actuels.

Nous préférons rester sur Salesforce — la migration serait laborieuse. Mais les chiffres doivent fonctionner :

- 32 licences (et non 40)
- Remise de 8 % sur un engagement de 2 ans
- Soit environ 26 500 €/an

Si vous pouvez confirmer d'ici le [date], nous signons le renouvellement de 2 ans. C'est 53 000 € de revenus garantis.

Cordialement,
[Votre Nom]`,
    },
  },
  assumptions: [
    "Utilisateurs actifs : 28 sur 40 licences d'après un audit des dernières connexions",
    "Tarif catalogue Salesforce Sales Cloud Professional : 75 €/utilisateur/mois",
    "Remise pluriannuelle de ~8 % basée sur les négociations typiques de renouvellement Salesforce",
    "Économie licences : (40 − 32) × 75 € × 12 = 7 200 €/an. Remise pluriannuelle : 8 % × 28 800 € = 2 304 €/an. Total : 9 504 €/an",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel. Vérifiez toutes les informations de manière indépendante et consultez des conseillers agréés avant de prendre des décisions d'approvisionnement.",
}

// Exemple 3 : Fournitures de bureau — calcul simple de remise volume
// Arithmétique :
//   Dépenses annuelles catalogue : 45 000 €
//   Remise actuelle 5 % : 45 000 € × 5 % = 2 250 € → engagement actuel : 42 750 €
//   Remise cible 15 % : 45 000 € × 15 % = 6 750 € → engagement cible : 38 250 €
//   Économie remise supplémentaire : 6 750 € − 2 250 € = 4 500 €/an
//   Frais de livraison : 8,50 € × 10 commandes × 12 mois = 1 020 €/an
//   Économie totale : 4 500 € + 1 020 € = 5 520 €/an
export const officeSuppliesExampleFr: DealOutput = {
  title: "Lyreco - Contrat annuel de fournitures de bureau",
  vendor: "Lyreco",
  category: "Fournitures de bureau",
  description: "Contrat annuel pour fournitures de bureau, consommables d'impression et produits d'entretien",
  verdict: "Vous obtenez une remise de 5 % sur 45 000 € de dépenses annuelles. À ce volume, 15 à 20 % est la norme. Vous laissez 5 520 €/an sur la table.",
  verdict_type: "negotiate",
  price_insight: "Une remise de 5 % vous fait économiser 2 250 €/an. Une remise de 15 % vous ferait économiser 6 750 € — soit 4 500 € de plus par an pour une seule conversation.",
  snapshot: {
    vendor_product: "Lyreco / Contrat annuel entreprise",
    term: "12 mois",
    total_commitment: "42 750 €",
    billing_payment: "Facturation mensuelle, paiement à 30 jours",
    pricing_model: "Prix catalogue moins 5 % sur toutes les catégories",
    deal_type: "Renewal",
    renewal_date: "1er juin 2026",
  },
  quick_read: {
    whats_solid: [
      "Livraison en 24h sur la plupart des articles, service fiable",
      "Portail de commande en ligne avec flux d'approbation par service",
      "Responsable de compte dédié pour les commandes importantes",
    ],
    whats_concerning: [
      "Seulement 5 % de remise malgré 45 000 €/an de dépenses — devrait être 15 à 20 %",
      "Frais de livraison de 8,50 € sur les commandes de moins de 50 € — cela représente 1 020 €/an sur les petites commandes",
      "Aucun verrouillage des prix — vous êtes exposé à des hausses en cours d'année",
    ],
    conclusion: "Bon service, mauvais tarif. Exigez 15 % de remise, la livraison gratuite et le verrouillage des prix sur vos articles principaux. Économie de 5 520 €/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Remise de 5 % sur 45 000 € de dépenses — devrait être au minimum 15 %",
      why_it_matters: "À 45 000 €/an, la plupart des contrats de fournitures de bureau offrent 15 à 20 % de remise sur le prix catalogue. Vous obtenez 5 % (2 250 € d'économies). À 15 %, vous économiseriez 6 750 € — soit 4 500 €/an de plus, simplement en le demandant.",
      what_to_ask_for: "Augmenter la remise de 5 % à 15 % sur toutes les catégories. Sur 45 000 € de dépenses catalogue, cela représente 4 500 €/an d'économies supplémentaires par rapport aux conditions actuelles.",
      if_they_push_back: "Accepter 12 % (3 150 € d'économies supplémentaires) ou un système par palier : 10 % sur les fournitures générales, 20 % sur les articles à fort volume comme le papier et le toner.",
    },
    {
      type: "Commercial",
      issue: "Frais de livraison de 8,50 € sur les commandes de moins de 50 €",
      why_it_matters: "Votre bureau passe environ 10 petites commandes par mois sous le seuil de 50 €. Soit 8,50 € × 10 × 12 = 1 020 €/an en frais de livraison. La livraison gratuite est la norme sur les contrats professionnels à ce niveau de dépenses.",
      what_to_ask_for: "Supprimer tous les frais de livraison pour les clients sous contrat. Économie de 1 020 €/an. C'est un prérequis de base pour un compte à 45 000 €/an.",
      if_they_push_back: "Abaisser le seuil de livraison gratuite de 50 € à 25 €, ou plafonner les frais de livraison à 4 € par commande.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Vous dépensez 45 000 €/an — vous êtes un compte à forte valeur qu'ils ne veulent pas perdre",
      "Amazon Business offre 15 % de remise + livraison gratuite sans contrat",
      "Vous pouvez consolider vos dépenses auprès de plusieurs fournisseurs pour atteindre un volume supérieur",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Augmenter l'engagement à 55 000 €/an en échange d'une remise de 18 %",
      "Consolider les consommables d'impression (7 000 €/an de revenus supplémentaires pour eux)",
      "Signer un contrat de 2 ans pour un verrouillage des prix et un palier de remise supérieur",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Augmenter la remise de 5 % à 15 % (économie de 4 500 €/an sur 45 000 € de dépenses)",
      "Supprimer les frais de livraison pour toutes les commandes sous contrat (économie de 1 020 €/an)",
      "Verrouiller les prix sur vos 20 articles principaux (papier, toner, produits d'entretien) pendant 12 mois",
    ],
    nice_to_have: [
      "Revue d'activité trimestrielle pour optimiser les dépenses et identifier des économies",
      "Retours gratuits sur les articles non ouverts dans les 30 jours",
    ],
  },
  potential_savings: [
    {
      ask: "Augmenter la remise de 5 % à 15 %",
      annual_impact: "4 500 € économisés",
    },
    {
      ask: "Supprimer les frais de livraison",
      annual_impact: "1 020 € économisés",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Renouvellement contrat Lyreco — Discussion tarifaire",
      body: `Bonjour [Nom],

Merci pour l'envoi des conditions de renouvellement. Nous sommes satisfaits du service et souhaitons continuer.

Avant de signer, j'aimerais aborder la question des tarifs. À 45 000 €/an de dépenses, nous bénéficions actuellement de 5 % de remise sur le prix catalogue. La norme du marché pour ce volume est de 15 à 20 % — serait-il possible de passer à 15 % ?

Par ailleurs, les frais de livraison de 8,50 € sur les petites commandes s'accumulent. Serait-il possible de les supprimer pour les clients sous contrat ?

Ces deux ajustements faciliteraient grandement le renouvellement de notre côté. Je suis disponible pour en discuter cette semaine.

Cordialement,
[Votre Nom]`,
    },
    firm: {
      subject: "Renouvellement Lyreco — Tarifs à revoir pour continuer",
      body: `Bonjour [Nom],

Nous examinons notre renouvellement Lyreco et les tarifs ne sont pas compétitifs.

Conditions actuelles :
- Remise de 5 % sur 45 000 € de dépenses annuelles
- Frais de livraison de 8,50 € sur les commandes de moins de 50 € (~1 020 €/an)

Comparaison marché :
- Amazon Business : 15 % de remise, livraison gratuite, sans contrat
- Bureau Vallée Pro : 12 % de remise + livraison gratuite pour les comptes à 40 000 €+

Ce qu'il nous faut pour renouveler :
1. Remise de 15 % (et non 5 %) — économie de 4 500 €/an
2. Livraison gratuite sur toutes les commandes — économie de 1 020 €/an
3. Verrouillage des prix sur les 20 références principales pendant 12 mois

Nous apprécions la gestion de compte chez Lyreco, mais un écart de 10 points sur la remise par rapport à Amazon est difficile à justifier.

Pouvez-vous nous envoyer des conditions révisées d'ici la fin de la semaine ?

Cordialement,
[Votre Nom]`,
    },
    final_push: {
      subject: "Décision finale — Renouvellement contrat Lyreco",
      body: `Bonjour [Nom],

Nous devons finaliser le choix de notre fournisseur de fournitures d'ici le 15 mai.

Nous voulons rester chez Lyreco, mais l'offre actuelle coûte 5 520 €/an de plus qu'Amazon Business :
- Lyreco : 5 % de remise + 1 020 € de frais de livraison
- Amazon : 15 % de remise + livraison gratuite

Pour renouveler, il nous faut :
- Remise de 15 % sur toutes les catégories
- Livraison gratuite
- Verrouillage des prix sur les 20 articles principaux

Si vous pouvez confirmer d'ici le 10 mai, nous signons un contrat de 2 ans — soit plus de 90 000 € de revenus garantis.

Dans le cas contraire, nous transférons nos achats vers Amazon Business dès le 1er juin.

Cordialement,
[Votre Nom]`,
    },
  },
  assumptions: [
    "Dépenses annuelles catalogue de 45 000 € avant remise",
    "Environ 120 petites commandes/an sous le seuil de 50 € × 8,50 € = 1 020 € en frais de livraison",
    "Références de remise volume basées sur des contrats de fournitures de bureau comparables à 45 000 € de dépenses annuelles",
  ],
  disclaimer: "Cette analyse est fournie à titre informatif uniquement et ne constitue pas un conseil juridique, financier ou professionnel. Vérifiez toutes les informations de manière indépendante et consultez des conseillers agréés avant de prendre des décisions d'approvisionnement.",
}

export const examplesFr = {
  marketing: marketingAgencyExampleFr,
  saas: saasEmailExampleFr,
  supplies: officeSuppliesExampleFr,
}

export type ExampleType = keyof typeof examplesFr
