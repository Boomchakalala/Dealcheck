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

// Exemple 2 : Outil SaaS — HubSpot Marketing Hub, gaspillage de capacité évident
// Arithmétique :
//   Contrat actuel : 100 000 contacts à 2 000 €/mois = 24 000 €/an
//   Utilisation réelle : 35 000 contacts — 65 % de capacité gaspillée
//   Palier 50 000 contacts : 1 200 €/mois = 14 400 €/an
//   Économie palier : 24 000 € − 14 400 € = 9 600 €/an
//   Remise facturation annuelle (~15 %) : 15 % × 14 400 € = 2 160 €
//   Coût annuel après remise : 14 400 € − 2 160 € = 12 240 €/an
//   Économie totale : 24 000 € − 12 240 € = 11 760 €/an (49 % du contrat actuel)
export const saasEmailExampleFr: DealOutput = {
  title: "HubSpot Marketing Hub - Renouvellement Plan Professionnel",
  vendor: "HubSpot",
  category: "SaaS - Marketing",
  description: "Plateforme d'automatisation marketing, emailing et CRM",
  verdict: "Vous payez pour 100 000 contacts mais n'en utilisez que 35 000 — vous gaspillez 65 % de votre capacité. Descendre au palier 50 000 et passer à la facturation annuelle vous fait économiser 11 760 €/an.",
  verdict_type: "negotiate",
  price_insight: "Vous payez 2 000 €/mois pour le palier 100 000 contacts. Le palier 50 000 à 1 200 €/mois couvre largement vos 35 000 contacts avec de la marge, et la facturation annuelle ajoute 15 % de remise supplémentaire.",
  snapshot: {
    vendor_product: "HubSpot / Marketing Hub Professional",
    term: "12 mois",
    total_commitment: "24 000 €",
    billing_payment: "Mensuel 2 000 €",
    pricing_model: "Par palier selon le nombre de contacts — 100 000 contacts",
    deal_type: "Renewal",
    renewal_date: "1er mai 2026",
  },
  quick_read: {
    whats_solid: [
      "Toutes les fonctionnalités Professional : automatisation, tests A/B, reporting avancé",
      "Intégration CRM déjà en place avec votre équipe commerciale",
      "Support réactif et ressources d'onboarding complètes",
    ],
    whats_concerning: [
      "Vous payez pour 100 000 contacts mais n'en utilisez que 35 000 — 65 % de capacité gaspillée",
      "Aucune remise pour facturation annuelle — vous payez au tarif mensuel plein",
      "Renouvellement automatique au même palier surdimensionné si vous n'agissez pas",
    ],
    conclusion: "Bon outil, mauvais palier. Descendez à 50 000 contacts et passez à la facturation annuelle pour économiser 11 760 €/an.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Vous payez pour 100 000 contacts alors que vous n'en utilisez que 35 000",
      why_it_matters: "Vous payez 2 000 €/mois pour le palier 100 000 contacts mais n'en avez que 35 000. Le palier 50 000 contacts coûte 1 200 €/mois — il couvre largement votre base actuelle avec 43 % de marge de croissance. Vous gaspillez 800 €/mois = 9 600 €/an.",
      what_to_ask_for: "Descendre au palier 50 000 contacts à 1 200 €/mois. Économie de 800 €/mois = 9 600 €/an. Vous pouvez remonter au palier supérieur à tout moment si vous dépassez les 50 000 contacts.",
      if_they_push_back: "Demander un palier intermédiaire personnalisé à 40 000 contacts à 1 000 €/mois, ou rester à 50 000.",
    },
    {
      type: "Commercial",
      issue: "Pas de remise pour facturation annuelle — 2 160 € laissés sur la table",
      why_it_matters: "HubSpot offre environ 15 % de remise pour un engagement annuel prépayé. Sur le palier 50 000 contacts (1 200 €/mois = 14 400 €/an), la facturation annuelle coûterait 12 240 €/an. Soit 2 160 € d'économies supplémentaires en plus du changement de palier.",
      what_to_ask_for: "Passer à la facturation annuelle sur le palier 50 000 contacts. Payer 12 240 €/an au lieu de 14 400 €. Combiné au changement de palier, économie totale = 11 760 €/an par rapport au contrat actuel de 24 000 €.",
      if_they_push_back: "Accepter la facturation mensuelle sur le palier 50 000 contacts — économie tout de même de 9 600 €/an par rapport au contrat actuel.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Vous êtes un client en renouvellement — la fidélisation coûte moins cher que l'acquisition pour HubSpot",
      "Les concurrents comme ActiveCampaign et Brevo facturent à l'usage réel, pas par paliers surdimensionnés",
      "Vous avez 2 mois avant le renouvellement — le temps d'évaluer les alternatives",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "S'engager sur un plan annuel de 2 ans pour une remise supplémentaire de 10 %",
      "Rédiger un avis G2 et participer à une étude de cas client",
      "Ajouter un poste Sales Hub (plus de revenus pour HubSpot) en échange d'un tarif marketing avantageux",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Descendre du palier 100 000 au palier 50 000 contacts — 1 200 €/mois au lieu de 2 000 € (économie de 9 600 €/an)",
      "Passer à la facturation annuelle pour une remise de 15 % — 12 240 €/an au lieu de 14 400 € (économie supplémentaire de 2 160 €)",
    ],
    nice_to_have: [
      "Gel des prix sur 2 ans pour éviter les augmentations futures",
      "Session d'onboarding gratuite pour un nouveau membre de l'équipe",
    ],
  },
  potential_savings: [
    {
      ask: "Descendre du palier 100 000 au palier 50 000 contacts",
      annual_impact: "9 600 € économisés",
    },
    {
      ask: "Passer à la facturation annuelle (remise de 15 %)",
      annual_impact: "2 160 € économisés",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Renouvellement HubSpot — Demande d'ajustement de plan",
      body: `Bonjour [Nom],

Merci pour le rappel de renouvellement. Nous souhaitons continuer avec HubSpot mais devons ajuster notre plan.

Nous sommes actuellement sur le palier 100 000 contacts à 2 000 €/mois, mais nous n'avons que 35 000 contacts. C'est beaucoup de capacité inutilisée.

Serait-il possible de passer au palier 50 000 contacts à 1 200 €/mois ? Cela nous laisse encore 43 % de marge de croissance. Et si nous passons à la facturation annuelle, nous aimerions bénéficier de la remise prépaiement.

Nous sommes prêts à nous engager sur 12 mois. Pouvez-vous nous envoyer le tarif annuel sur le palier 50 000 contacts ?

Cordialement,
[Votre Nom]`,
    },
    firm: {
      subject: "Renouvellement HubSpot — Ajustement tarifaire nécessaire",
      body: `Bonjour [Nom],

Nous examinons notre renouvellement HubSpot et les chiffres ne fonctionnent pas au palier actuel.

Les faits :
- Nous avons 35 000 contacts
- Nous payons pour 100 000 contacts (2 000 €/mois)
- Cela représente 9 600 €/an de capacité inutilisée

Ce dont nous avons besoin :
1. Descendre au palier 50 000 contacts (1 200 €/mois)
2. Facturation annuelle avec la remise standard de 15 %

Nous avons étudié ActiveCampaign et Brevo — les deux offrent des fonctionnalités comparables entre 500 et 800 €/mois pour notre volume de contacts. Nous préférons rester sur HubSpot car l'intégration est déjà en place, mais nous avons besoin d'un tarif qui reflète notre utilisation réelle.

Pouvez-vous nous envoyer des conditions révisées ?

Cordialement,
[Votre Nom]`,
    },
    final_push: {
      subject: "Renouvellement HubSpot — Décision finale requise",
      body: `Bonjour [Nom],

Notre renouvellement est dans 3 semaines et nous devons prendre une décision.

Nous avons été satisfaits de HubSpot, mais payer 24 000 €/an pour 35 000 contacts quand les concurrents proposent l'équivalent entre 6 000 et 9 000 € n'a pas de sens.

Voici ce qui nous ferait rester :
- Palier 50 000 contacts avec facturation annuelle (12 240 €/an)
- Gel des prix sur 2 ans

Si vous pouvez confirmer d'ici le [date], nous renouvelons immédiatement. Sinon, nous migrons vers ActiveCampaign — ils nous ont déjà proposé des crédits d'onboarding.

Cordialement,
[Votre Nom]`,
    },
  },
  assumptions: [
    "Nombre actuel de contacts : 35 000 contacts actifs dans HubSpot",
    "Tarification standard HubSpot : palier 100 000 = 2 000 €/mois, palier 50 000 = 1 200 €/mois",
    "Remise pour facturation annuelle d'environ 15 % basée sur les tarifs publiés par HubSpot",
    "Économie palier : 24 000 € − 14 400 € = 9 600 €/an. Remise annuelle : 15 % × 14 400 € = 2 160 €. Total : 9 600 € + 2 160 € = 11 760 €/an",
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
