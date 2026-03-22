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
    total: 6000,
    currency: "EUR",
    must_have: [
      {
        ask: "Ajustement de 40 à 30 licences",
        amount: 6000,
        rationale: "15 licences inutilisées — supprimer le gaspillage ne nécessite aucune concession",
      },
    ],
    nice_to_have: [
      {
        ask: "Remise de fidélité de 10 % sur le contrat ajusté",
        amount: 1800,
        rationale: "Remise de renouvellement standard — les responsables de comptes DocuSign ont l'autorité pour 10-15 %",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Renouvellement DocuSign",
      body: `Bonjour [Nom],

On adore DocuSign et on veut boucler ce renouvellement rapidement. J'ai juste besoin de clarifier deux points de notre c\u00f4t\u00e9.

Nous avons actuellement 40 licences, mais en regardant nos donn\u00e9es d'utilisation, seules 25 personnes se connectent r\u00e9guli\u00e8rement. Serait-il possible de passer \u00e0 30 ? Cela nous laisse une marge confortable sans payer des licences que personne n'utilise, et nous ram\u00e8ne \u00e0 \u20ac1 500/mois.

Par ailleurs, cela fait 2 ans que nous sommes clients fid\u00e8les. Y a-t-il une marge de man\u0153uvre pour une remise de fid\u00e9lit\u00e9 ? M\u00eame 10 % sur le contrat ajust\u00e9 ferait vraiment la diff\u00e9rence. PandaDoc nous sollicite avec des tarifs agressifs, mais honn\u00eatement, on pr\u00e9f\u00e8re rester si les chiffres tiennent la route.

Si on peut atterrir autour de \u20ac16 200/an, je suis pr\u00eat \u00e0 signer un engagement de 2 ans cette semaine. Je peux aussi laisser un avis sur G2 si cela vous aide.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Renouvellement DocuSign",
      body: `Bonjour [Nom],

Je reviens vers vous au sujet du renouvellement. Nous devons r\u00e9gler deux points avant de pouvoir signer.

D'abord, le nombre de licences. Nous en avons 40 mais seulement 25 sont actives. Payer 15 licences vides \u00e0 \u20ac50/mois n'est pas justifiable en interne. Nous devons passer \u00e0 30.

Ensuite, apr\u00e8s 2 ans en tant que client, nous avons besoin d'une remise de fid\u00e9lit\u00e9 sur ce renouvellement. PandaDoc nous propose 30 % en dessous de votre tarif actuel, et m\u00eame si on pr\u00e9f\u00e8re rester chez DocuSign, on ne peut pas ignorer cet \u00e9cart. Une remise de 10 % sur le contrat ajust\u00e9 nous am\u00e8nerait \u00e0 \u20ac16 200/an.

On s'engage volontiers sur 2 ans \u00e0 ce montant. Pouvez-vous confirmer d'ici vendredi pour qu'on boucle le dossier ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Renouvellement DocuSign",
      body: `Bonjour [Nom],

Je pr\u00e9f\u00e8re \u00eatre franc avec vous. On \u00e9change sur ce renouvellement depuis un moment, et nous devons prendre une d\u00e9cision avant le 1er avril.

Nous ne renouvellerons pas \u00e0 40 licences alors que 25 seulement sont actives. Cela repr\u00e9sente \u20ac9 000/an de gaspillage, et notre direction financi\u00e8re l'a signal\u00e9. Nous avons aussi besoin d'un tarif de fid\u00e9lit\u00e9 apr\u00e8s 2 ans. PandaDoc a une proposition sign\u00e9e sur mon bureau, 30 % en dessous de votre tarif actuel.

Voici ce qui fonctionne pour nous : 30 licences, remise de fid\u00e9lit\u00e9 de 10 %, \u20ac16 200/an. On signe un engagement de 2 ans aujourd'hui si vous confirmez. Sinon, nous devrons avancer sur notre \u00e9valuation des alternatives cette semaine.

Cordialement,
[Votre nom]`,
    },
  },
  score: 62,
  score_label: "Correct, n\u00e9gocier les d\u00e9tails",
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
    total: 7200,
    currency: "EUR",
    must_have: [
      {
        ask: "Ajustement de 40 à 32 licences",
        amount: 7200,
        rationale: "12 licences inutilisées — supprimer le gaspillage ne nécessite aucune concession",
      },
    ],
    nice_to_have: [
      {
        ask: "Remise de fidélité de 8 % sur le contrat ajusté",
        amount: 2304,
        rationale: "Remise pluriannuelle standard — les responsables Salesforce proposent régulièrement 8-12 %",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Renouvellement Salesforce",
      body: `Bonjour [Nom],

Cela fait 3 ans que nous sommes sur Sales Cloud et l'\u00e9quipe l'utilise au quotidien, donc le renouvellement est clairement pr\u00e9vu. Je veux simplement m'assurer que le contrat refl\u00e8te notre utilisation r\u00e9elle de la plateforme.

Nous payons actuellement 40 licences, mais j'ai lanc\u00e9 un audit des connexions et seules 28 personnes sont actives. Serait-il possible d'ajuster \u00e0 32 ? Cela nous garde une petite marge sans les \u20ac900/mois qu'on d\u00e9pense aujourd'hui en licences vides.

Autre point, cela fait 3 ans que nous sommes clients et nous n'avons jamais demand\u00e9 de remise. Y a-t-il de la flexibilit\u00e9 sur un tarif pluriannuel ? Si on s'engage sur 2 ans, 8 % serait-il envisageable ? HubSpot nous d\u00e9marche fortement \u00e0 \u20ac40-50/licence, mais migrer un CRM est douloureux et on pr\u00e9f\u00e9rerait \u00e9viter.

Cela nous am\u00e8nerait autour de \u20ac26 500/an. Si le tarif unitaire descend \u00e0 \u20ac70, on envisagerait aussi d'ajouter des licences Service Cloud.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Renouvellement Salesforce",
      body: `Bonjour [Nom],

Je dois vous signaler deux probl\u00e8mes sur le renouvellement qui bloquent les choses de notre c\u00f4t\u00e9.

Notre nombre de licences est incorrect. Nous payons pour 40 mais seulement 28 sont actives. Cela fait 12 licences \u00e0 \u20ac75/mois inutilis\u00e9es, et le sujet a \u00e9t\u00e9 remont\u00e9 en interne. Nous devons passer \u00e0 32.

Sur le tarif, apr\u00e8s 3 ans en tant que client, nous nous attendions \u00e0 ce qu'une remise pluriannuelle fasse partie de ce renouvellement. HubSpot nous propose un tarif bien en dessous du v\u00f4tre, et notre \u00e9quipe demande pourquoi on n'explore pas cette option. Une remise de 8 % sur un engagement de 2 ans r\u00e9glerait la question. Cela donne \u20ac26 496/an.

J'aimerais r\u00e9soudre cela cette semaine pour pouvoir arr\u00eater l'\u00e9valuation concurrentielle. Pouvez-vous revenir avec des conditions mises \u00e0 jour ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Renouvellement Salesforce",
      body: `Bonjour [Nom],

Je vais droit au but. Notre renouvellement arrive le 1er juin et nous devons trancher.

Nous avons men\u00e9 une \u00e9valuation compl\u00e8te de HubSpot le mois dernier. Leur tarif est 40 % en dessous du v\u00f4tre, et l'\u00e9cart fonctionnel s'est consid\u00e9rablement r\u00e9duit. La seule raison pour laquelle nous n'avons pas migr\u00e9, c'est le co\u00fbt de migration et le fait que notre \u00e9quipe conna\u00eet Salesforce.

Mais nous ne pouvons pas renouveler \u00e0 40 licences quand 12 sont inutilis\u00e9es, et nous avons besoin d'une remise pluriannuelle apr\u00e8s 3 ans. Voici ce qui fonctionne : 32 licences, remise de 8 %, engagement de 2 ans, \u20ac26 496/an. Je peux faire signer cette semaine si vous confirmez.

Si on n'y arrive pas, nous lancerons la migration HubSpot. Je pr\u00e9f\u00e9rerais \u00e9viter, mais les chiffres doivent tenir.

Cordialement,
[Votre nom]`,
    },
  },
  score: 48,
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

// Exemple 3 : Microsoft 365 — Renouvellement Business Premium (CONTRAT PROPRE)
export const microsoft365ExampleFr: DealOutput = {
  title: "Microsoft 365 \u00b7 Business Premium \u00b7 Renouvellement annuel",
  vendor: "Microsoft 365",
  category: "SaaS - Productivit\u00e9",
  description: "Suite de productivit\u00e9 \u2014 applications Office, Teams, Exchange, Intune, Defender",
  verdict: "Ce contrat est bien structur\u00e9. Le tarif est comp\u00e9titif, le nombre de licences correspond \u00e0 l'utilisation, et les conditions sont standard. Optimisation mineure uniquement.",
  verdict_type: "competitive",
  price_insight: "\u00c0 \u20ac38/utilisateur/mois sur 50 licences en pr\u00e9paiement annuel, c'est en ligne avec les tarifs standard M365 Business Premium via revendeurs.",
  snapshot: {
    vendor_product: "Microsoft 365 / Business Premium",
    term: "12 mois",
    total_commitment: "\u20ac22,800",
    billing_payment: "Pr\u00e9paiement annuel",
    pricing_model: "Par licence, facturation annuelle",
    deal_type: "Renewal",
    renewal_date: "May 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Nombre de licences correspond aux utilisateurs actifs, pas de gaspillage",
      "Tarif pr\u00e9pay\u00e9 annuel d\u00e9j\u00e0 appliqu\u00e9",
      "Suite s\u00e9curit\u00e9 compl\u00e8te incluse (Intune, Defender, Azure AD P1)",
    ],
    whats_concerning: [
      "Pr\u00e9avis de renouvellement automatique de 30 jours serr\u00e9 pour un engagement de \u20ac22 800",
    ],
    conclusion: "Contrat propre. Signez-le, mais verrouillez le tarif pour 2 ans et allongez le pr\u00e9avis de renouvellement.",
  },
  red_flags: [
    {
      type: "Renewal",
      issue: "Pr\u00e9avis de renouvellement automatique de 30 jours sur un engagement de \u20ac22 800",
      why_it_matters: "Un pr\u00e9avis court limite votre capacit\u00e9 \u00e0 ren\u00e9gocier ou comparer les alternatives avant que le contrat ne se renouvelle automatiquement au tarif fix\u00e9 par le revendeur.",
      what_to_ask_for: "Allonger le pr\u00e9avis de renouvellement de 30 \u00e0 60 jours",
      if_they_push_back: "Demander un rappel par email 90 jours avant la date de renouvellement",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Client fid\u00e8le qui renouvelle sans probl\u00e8me",
      "Un compte de 50 licences repr\u00e9sente un volume significatif pour le revendeur",
      "Le pr\u00e9paiement annuel r\u00e9duit leur risque de recouvrement",
    ],
    trades_you_can_offer: [
      "S'engager sur 2 ans pour un verrouillage tarifaire",
      "Consolider les licences suppl\u00e9mentaires chez eux",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Verrouiller le tarif pour 2 ans au tarif actuel",
      "Allonger le pr\u00e9avis de renouvellement \u00e0 60 jours",
    ],
    nice_to_have: [
      "Inclure 5 licences Copilot \u00e0 tarif r\u00e9duit en essai",
    ],
  },
  potential_savings: {
    total: 684,
    currency: "EUR",
    must_have: [
      {
        ask: "Remise fid\u00e9lit\u00e9 de 3 % pour engagement sur 2 ans",
        amount: 684,
        rationale: "Demande modeste en \u00e9change d'un revenu garanti sur 2 ans",
      },
    ],
    nice_to_have: [],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Renouvellement Microsoft 365",
      body: `Bonjour [Nom],

Bonne nouvelle de notre c\u00f4t\u00e9. Business Premium fonctionne tr\u00e8s bien, le nombre de licences est bon, et l'\u00e9quipe est satisfaite. Nous sommes pr\u00eats \u00e0 renouveler.

J'ai juste deux petites demandes avant de finaliser. Premi\u00e8rement, serait-il possible de verrouiller le tarif de \u20ac38/utilisateur pour 2 ans ? Nous nous engagerions volontiers sur un contrat de 2 ans en \u00e9change. Cela nous \u00e9vite les allers-retours l'ann\u00e9e prochaine, et vous avez un revenu garanti sur 50 licences.

Deuxi\u00e8mement, le pr\u00e9avis de renouvellement automatique de 30 jours est serr\u00e9 pour un engagement de \u20ac22 800. Serait-il possible de l'allonger \u00e0 60 jours ? Juste pour nous laisser le temps de planifier en interne.

Si ces deux points fonctionnent, je peux faire signer avant la fin de semaine. Un renouvellement simple pour tout le monde.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Renouvellement Microsoft 365",
      body: `Bonjour [Nom],

Nous sommes pr\u00eats \u00e0 renouveler le contrat Business Premium de 50 licences, mais j'ai besoin de deux confirmations avant de signer.

Nous avons besoin que le tarif actuel de \u20ac38/utilisateur soit verrouill\u00e9 pour 2 ans. Nous nous engageons sur un contrat de 2 ans, donc un gel tarifaire est un \u00e9change \u00e9quitable. Nous avons aussi besoin que le pr\u00e9avis de renouvellement passe de 30 \u00e0 60 jours. Sur un contrat de cette taille, 30 jours ne suffisent pas.

Ce sont des demandes simples. Pouvez-vous confirmer pour qu'on boucle le dossier ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Renouvellement Microsoft 365",
      body: `Bonjour [Nom],

Notre renouvellement du 1er mai approche et j'aimerais r\u00e9gler cela. Le contrat est bon et nous voulons rester, mais j'attends toujours la confirmation sur le gel tarifaire de 2 ans \u00e0 \u20ac38/utilisateur et le pr\u00e9avis de renouvellement de 60 jours.

Ce sont des demandes mineures sur un renouvellement par ailleurs impeccable. 50 licences, engagement de 2 ans, z\u00e9ro complication. J'ai juste besoin d'un oui sur ces deux points et on signe imm\u00e9diatement.

Pouvez-vous confirmer d'ici la fin de semaine ?

Cordialement,
[Votre nom]`,
    },
  },
  score: 84,
  score_label: "Pr\u00eat \u00e0 signer",
  score_breakdown: {
    pricing_fairness: 46,
    terms_protections: 22,
    leverage_position: 16,
    pricing_deductions: [
      { points: 4, reason: "Marge mineure pour une remise fid\u00e9lit\u00e9" },
    ],
    terms_deductions: [
      { points: 5, reason: "Pr\u00e9avis de renouvellement automatique de 30 jours serr\u00e9" },
      { points: 3, reason: "Pas de garantie de verrouillage tarifaire au renouvellement" },
    ],
    leverage_deductions: [
      { points: 4, reason: "Engagement annuel d\u00e9j\u00e0 en place" },
    ],
  },
  score_rationale: "Contrat bien structur\u00e9 avec des conditions standard. Optimisation mineure possible sur le pr\u00e9avis et le verrouillage tarifaire.",
  assumptions: [
    "50 licences correspondent aux utilisateurs actifs",
    "Le tarif de \u20ac38/utilisateur est comp\u00e9titif pour M365 Business Premium via revendeur",
  ],
  disclaimer: "Cette analyse est un conseil commercial, pas un avis juridique. V\u00e9rifiez les conditions finales avant signature.",
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
    total: 12552,
    currency: "USD",
    must_have: [
      {
        ask: "Tarif de base de $4,20 à $3,50 (1 000 moy./mois)",
        amount: 8400,
        rationale: "Le tarif négocié du marché est de $3,20-3,60 à ce volume — bien documenté",
      },
      {
        ask: "Surcharge carburant de 20 % à 12 %",
        amount: 4152,
        rationale: "Les surcharges du marché se situent entre 10-14 % — 20 % est au-dessus du marché",
      },
    ],
    nice_to_have: [],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Accord FedEx",
      body: `Bonjour [Nom],

La couverture et les niveaux de service nous conviennent parfaitement, et nous aimerions avancer avec FedEx. Je voudrais juste revoir quelques chiffres avant de finaliser.

Le tarif de base de $4,20/colis est plus \u00e9lev\u00e9 que ce qu'on nous propose ailleurs pour notre volume. \u00c0 1 000 colis/mois, les tarifs n\u00e9goci\u00e9s comparables se situent entre $3,20 et $3,60. Serait-il possible de viser $3,50 ?

C\u00f4t\u00e9 surcharge carburant, 20 % sans plafond avec r\u00e9vision hebdomadaire rend la pr\u00e9vision des co\u00fbts tr\u00e8s difficile. Y a-t-il de la flexibilit\u00e9 pour plafonner \u00e0 12 % avec une r\u00e9vision mensuelle ? C'est davantage en ligne avec ce que nous observons sur le march\u00e9.

Dernier point, la clause GRI de 7,9 %. Sur un horizon de 3 ans, cela s'accumule vite. Pourrait-on s'accorder sur un plafond de 3,5 % pour la dur\u00e9e du contrat ?

Nous nous engagerions sur 1 100 colis/mois et un contrat de 2 ans si on r\u00e8gle ces points. C'est un volume garanti significatif pour votre \u00e9quipe.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Accord FedEx",
      body: `Bonjour [Nom],

Je pr\u00e9f\u00e8re \u00eatre transparent sur notre position. Le r\u00e9seau FedEx nous pla\u00eet, mais les conditions commerciales doivent bouger avant qu'on puisse signer.

Le tarif de base de $4,20/colis est au-dessus du march\u00e9. UPS nous a propos\u00e9 $3,30 pour la m\u00eame tranche de volume. Nous avons besoin de $3,50. La surcharge carburant de 20 % sans plafond est r\u00e9dhibitoire pour notre direction financi\u00e8re. Le march\u00e9 est \u00e0 10-14 %, et nous avons besoin d'un plafond \u00e0 12 % avec r\u00e9vision mensuelle. Le GRI de 7,9 % ajoutera plus de $4 000 \u00e0 nos co\u00fbts rien que l'ann\u00e9e prochaine. Nous avons besoin d'un plafond \u00e0 3,5 %.

Nous exp\u00e9dions plus de 1 000 colis par mois et sommes pr\u00eats \u00e0 nous engager, mais pas \u00e0 ces tarifs. Pouvez-vous revenir avec des conditions r\u00e9vis\u00e9es cette semaine ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Accord FedEx",
      body: `Bonjour [Nom],

Nous devons finaliser notre contrat de livraison cette semaine. J'ai une proposition sign\u00e9e d'UPS sur mon bureau \u00e0 $3,30/colis avec un plafond carburant de 12 % et un plafond GRI de 3 %.

Voici ce qui nous garde chez FedEx : tarif de base \u00e0 $3,50, plafond de surcharge carburant \u00e0 12 % avec r\u00e9vision mensuelle, et plafond GRI \u00e0 3,5 %. Nous nous engageons sur 1 100 colis/mois et un contrat de 2 ans. Cela repr\u00e9sente plus de $80 000 de chiffre d'affaires annuel garanti que vous pouvez inscrire d\u00e8s aujourd'hui.

Je dois donner une r\u00e9ponse \u00e0 UPS d'ici vendredi. Si vous confirmez ces conditions, on signe avec FedEx le jour m\u00eame.

Cordialement,
[Votre nom]`,
    },
  },
  score: 35,
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
    total: 2040,
    currency: "EUR",
    must_have: [
      {
        ask: "Tarif de location de €870 à €700/mois",
        amount: 2040,
        rationale: "Ricoh, Canon, Xerox proposent tous €620-720 pour des appareils équivalents",
      },
    ],
    nice_to_have: [
      {
        ask: "Économie toner marché ouvert (est.)",
        amount: 360,
        rationale: "Les toners tiers coûtent 25-35 % moins cher — dépend de la suppression de la clause",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Location Konica Minolta",
      body: `Bonjour [Nom],

Les sp\u00e9cifications du bizhub C360i correspondent bien \u00e0 nos besoins. Deux unit\u00e9s avec ce forfait d'impression couvrent nos volumes, et on aimerait mettre cela en place. Avant de s'engager sur 36 mois, je voudrais discuter de quelques points.

Sur le tarif de location, \u20ac870/mois est un peu \u00e9lev\u00e9 par rapport \u00e0 ce qu'on a vu ailleurs. Ricoh et Canon nous ont tous deux propos\u00e9 dans la fourchette \u20ac650-720 pour des appareils couleur A3/A4 \u00e9quivalents. Serait-il possible de viser \u20ac700 ?

La clause d'exclusivit\u00e9 toner nous pose aussi probl\u00e8me. Nous aurions besoin soit de la supprimer pour pouvoir nous approvisionner librement, soit de verrouiller les prix du toner aux tarifs actuels pour les 36 mois. On ne peut pas signer un contrat de 3 ans o\u00f9 les co\u00fbts de consommables ne sont pas ma\u00eetris\u00e9s.

Enfin, 36 mois sans option de sortie, c'est difficile \u00e0 faire passer en interne. Serait-il possible d'inclure une clause de sortie \u00e0 18 mois avec des frais de rachat de 3 mois ? Vous gardez un revenu garanti, et nous avons de la flexibilit\u00e9 si nos besoins \u00e9voluent.

Si on r\u00e8gle ces points, je suis pr\u00eat \u00e0 confirmer le contrat complet de 3 ans et \u00e0 ajouter l'extension de garantie.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Location Konica Minolta",
      body: `Bonjour [Nom],

Nous avons examin\u00e9 la proposition de location en d\u00e9tail et trois points doivent \u00eatre r\u00e9solus.

Le tarif de \u20ac870/mois est au-dessus du march\u00e9. Nous avons des devis \u00e9crits de Ricoh et Canon \u00e0 \u20ac650-720 pour des appareils \u00e9quivalents. Nous avons besoin de \u20ac700/mois. La clause d'exclusivit\u00e9 toner doit \u00eatre supprim\u00e9e, ou les prix du toner doivent \u00eatre verrouill\u00e9s pour les 36 mois. Nous ne pouvons pas accepter des co\u00fbts de consommables ouverts sur une location fixe. Et un contrat de 36 mois sans aucune option de sortie, notre service juridique ne validera pas. Nous avons besoin d'une clause de sortie \u00e0 18 mois avec des frais de 3 mois.

Nous voulons aller avec Konica Minolta, mais ces conditions doivent bouger. \u00c0 \u20ac700/mois avec ces ajustements, nous nous engageons imm\u00e9diatement sur les 3 ans. Pouvez-vous revenir avec des conditions r\u00e9vis\u00e9es ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Location Konica Minolta",
      body: `Bonjour [Nom],

Nous prenons notre d\u00e9cision de location d'imprimantes cette semaine et je veux donner sa chance \u00e0 Konica Minolta avant d'aller voir ailleurs.

La r\u00e9alit\u00e9, c'est que Ricoh nous a propos\u00e9 \u20ac680/mois pour des appareils comparables, avec approvisionnement toner libre et une clause de sortie \u00e0 18 mois. Votre proposition est \u00e0 \u20ac870/mois avec exclusivit\u00e9 toner et aucune sortie possible. L'\u00e9cart est significatif.

Voici ce qui bouclerait le dossier : \u20ac700/mois de location, exclusivit\u00e9 toner supprim\u00e9e ou tarifs verrouill\u00e9s pour 36 mois, et une clause de sortie \u00e0 18 mois avec rachat de 3 mois. Cela repr\u00e9sente quand m\u00eame plus de \u20ac25 200 de revenus de location garantis pour vous.

Je dois donner une r\u00e9ponse \u00e0 Ricoh d'ici vendredi. Si vous pouvez vous aligner sur ces conditions, on signe avec Konica Minolta le jour m\u00eame.

Cordialement,
[Votre nom]`,
    },
  },
  score: 44,
  score_label: "\u00c0 ren\u00e9gocier fermement",
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
    total: 3612,
    currency: "EUR",
    must_have: [
      {
        ask: "Taux horaire de €210 à €150 (35h/an)",
        amount: 2100,
        rationale: "Le taux du marché est de €130-160/heure — €210 est bien au-dessus de la norme",
      },
      {
        ask: "Augmentation annuelle de 12 % à 3 % (économie année 2)",
        amount: 1512,
        rationale: "3-5 % indexé sur l'IPC est la norme du secteur — 12 % est indéfendable",
      },
    ],
    nice_to_have: [
      {
        ask: "Plafonnement des heures — atténuation du risque (est.)",
        amount: 1500,
        rationale: "Empêche la facturation illimitée les années complexes — dépend de la négociation du plafond",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re : Proposition BDO",
      body: `Bonjour [Nom],

Le p\u00e9rim\u00e8tre du forfait correspond exactement \u00e0 ce dont nous avons besoin. Comptes de gestion, TVA, paie, fiscalit\u00e9, tout couvert avec un responsable senior d\u00e9di\u00e9. Nous sommes sinc\u00e8rement int\u00e9ress\u00e9s par une collaboration avec BDO.

Avant de signer, je voudrais discuter des conditions hors-p\u00e9rim\u00e8tre. Le taux de \u20ac210/heure est sensiblement au-dessus de ce qu'on nous propose ailleurs. Les cabinets comparables se situent \u00e0 \u20ac130-160 pour un travail similaire. Serait-il possible de viser \u20ac150 ?

Nous aurions aussi besoin de garde-fous sur les heures. Aujourd'hui il n'y a aucun plafond, ce qui veut dire qu'une situation fiscale complexe pourrait faire exploser la facture sans limite. Un plafond ferme de 35 heures annuelles, avec approbation pr\u00e9alable au-del\u00e0 de 10 heures dans un mois donn\u00e9, nous donnerait de la visibilit\u00e9 \u00e0 tous les deux.

Sur l'augmentation annuelle, 12 % est bien au-dessus de l'IPC et difficile \u00e0 budg\u00e9ter. Pourrait-on s'accorder sur 3 % ou l'IPC, le plus bas des deux ?

Si on r\u00e8gle ces points, j'aimerais m'engager sur 2 ans. Cela facilite la planification des deux c\u00f4t\u00e9s.

Cordialement,
[Votre nom]`,
    },
    firm: {
      subject: "Proposition BDO",
      body: `Bonjour [Nom],

Nous avons \u00e9tudi\u00e9 la proposition en d\u00e9tail et souhaitons avancer avec BDO, mais trois points doivent changer.

Le taux hors-p\u00e9rim\u00e8tre de \u20ac210/heure est significativement au-dessus du march\u00e9. Grant Thornton et Mazars proposent tous deux \u20ac130-160 pour un travail \u00e9quivalent. Nous avons besoin de \u20ac150. L'absence de plafond d'heures est un probl\u00e8me. Une exposition de facturation illimit\u00e9e, ce n'est pas quelque chose que nous pouvons valider. Nous avons besoin d'un plafond ferme de 35 heures annuelles avec approbation pr\u00e9alable au-del\u00e0 de 10 heures dans un mois donn\u00e9. Et la clause d'augmentation de 12 % doit baisser. Sur un forfait de \u20ac16 800, cela repr\u00e9sente plus de \u20ac2 000 de plus l'ann\u00e9e prochaine. Nous avons besoin de 3 % ou l'IPC.

Le forfait lui-m\u00eame est correct, et l'\u00e9quipe nous pla\u00eet. \u00c0 \u20ac150/heure avec un contr\u00f4le des co\u00fbts ad\u00e9quat, nous nous engageons sur 2 ans d\u00e8s aujourd'hui. Pouvez-vous envoyer des conditions r\u00e9vis\u00e9es cette semaine ?

Cordialement,
[Votre nom]`,
    },
    final_push: {
      subject: "Proposition BDO",
      body: `Bonjour [Nom],

Je vais \u00eatre direct. Nous devons d\u00e9signer notre cabinet comptable ce mois-ci, et nous h\u00e9sitons entre BDO et Mazars.

Mazars est arriv\u00e9 avec un forfait inf\u00e9rieur, un taux hors-p\u00e9rim\u00e8tre de \u20ac150/heure, un plafond d'heures ferme, et une augmentation annuelle de 3 %. Votre proposition pr\u00e9voit un taux horaire de \u20ac210, aucun plafond d'heures et un escalateur de 12 %. Sur le papier, l'\u00e9cart est difficile \u00e0 justifier aupr\u00e8s de notre conseil.

Voici ce qui nous garde chez BDO : \u20ac150/heure, plafond annuel de 35 heures avec approbation mensuelle, et augmentation annuelle de 3 % index\u00e9e sur l'IPC. Nous signons un engagement de 2 ans cette semaine si vous confirmez.

Je dois donner une r\u00e9ponse \u00e0 Mazars d'ici la fin du mois. Je pr\u00e9f\u00e9rerais sinc\u00e8rement BDO, mais les chiffres doivent fonctionner.

Cordialement,
[Votre nom]`,
    },
  },
  score: 72,
  score_label: "Correct, n\u00e9gocier les d\u00e9tails",
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
