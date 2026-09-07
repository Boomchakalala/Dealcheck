import type { BlogPost } from './blog'

/**
 * September 2026 batch — the blog was repositioned on SaaS, IT & infrastructure
 * and marketing spend. The car and equipment-lease posts were retired at the
 * same time (301s live in next.config.ts).
 */

export const postsEn: BlogPost[] = [
  {
    slug: 'how-to-negotiate-cloud-commit-aws-azure-gcp',
    title: 'How to negotiate a cloud commit (AWS, Azure, GCP) without overcommitting',
    description: 'Committed-spend deals buy you a discount with your own forecast. Here is how to size the commit, what the rep can actually move, and the clauses that protect you when usage changes.',
    date: '2026-09-02',
    readTime: '8 min read',
    category: 'IT & Infrastructure',
    content: `
## The discount is real. So is the trap.

Every major cloud provider sells the same deal: commit to spend a fixed amount over one to three years and get a percentage off. AWS calls it an EDP or a Private Pricing Agreement, Azure calls it a MACC, Google calls it a Commit Agreement. The mechanics are close enough to treat as one negotiation.

The pitch is simple. You are already spending the money, so why not get 10 to 20 percent off? The catch is in the word "commit". If you spend less than the number you signed, you still pay the number you signed.

Here is how to get the discount without buying your own forecast error.

---

## 1. Size the commit on what you will spend, not what you hope to

The rep will ask for your forecast and then propose a commit slightly above it. That is backwards. Your commit should sit below your confident floor, not at your target.

**What to look for:**
- Your trailing 12 months of actual spend, month by month, not the annual total
- Which workloads are planned to move off the platform, be re-architected, or be shut down
- Whether any large one-off project inflated last year's number

**The math matters.** If you spend $1.2M a year today and commit to $1.5M for three years at 15 percent off, you need 25 percent growth every year just to break even on the commitment. Miss it once and the shortfall is billed in full, usually in the final quarter of the term.

**What to ask:** "We will commit to $1.1M per year. Show us the discount at that level, and separately at $1.3M, so we can see what the extra commitment is actually buying."

---

## 2. Get the growth ramp, not a flat number

A flat three-year commit assumes year one and year three look the same. They never do. Providers can structure commits as a ramp, with a lower number in year one and a higher number in year three. Most reps will not offer it unless you ask.

**What to ask:** "Structure the commit as a ramp: $900k in year one, $1.1M in year two, $1.3M in year three. Same total, same discount tier."

If the rep says the discount tier is based on the annual number, ask for the tier to be set on the average across the term instead.

---

## 3. Check what counts toward the commit

Not every dollar you spend counts. Marketplace purchases, support fees, some third-party services, and certain regions are excluded by default in many agreements. If 20 percent of your bill does not count, your effective commit just went up by 25 percent.

**What to look for:**
- Whether marketplace spend counts, and up to what percentage
- Whether support plans count
- Whether spend from subsidiaries or separate accounts rolls up

**What to ask:** "Confirm in writing that marketplace, support and all linked accounts count toward the commit."

---

## 4. Negotiate the shortfall clause before you need it

Every commit agreement has a clause for what happens if you underspend. The default is that you pay the difference. The good versions let you roll a shortfall into an extended term, or apply it against the next agreement.

**What to ask:** "Add a shortfall provision: if we are under by less than 15 percent at the end of the term, the balance rolls into a 12-month extension at the same rate rather than being invoiced."

This is the single clause that makes a commit safe to sign. A rep who refuses it is telling you what they expect to happen.

---

## 5. The discount is not the only lever

The percentage off is the number everyone negotiates, so it is the number with the least room. The other levers usually have more.

**Things that cost the provider less than a discount point and are worth more to you:**
- Credits for migration or proof-of-concept work, often $25k to $100k
- Support tier upgrade included, or at a fixed price instead of a percentage of spend
- Training credits and architecture reviews
- Price protection on specific services you depend on
- A named technical account manager

**What to ask:** "Keep the discount at 12 percent and add $50k in migration credits plus Business support at a fixed annual fee."

---

## 6. Time the signature

Cloud reps have quarters, and their quarters end in a predictable pattern. A commit that closes in the last two weeks of a quarter is worth more to the rep than one that closes in the first two weeks of the next.

You do not need to play games. You need to know when the pressure is on their side of the table, and make sure your internal approvals are ready to move in that window.

---

## The bottom line

A cloud commit is you lending the provider certainty in exchange for a discount. Price the certainty correctly: commit below your floor, ramp it, make everything count, and get a shortfall clause. Then spend the negotiation on credits and support, where the provider has more room to give.

TermLift reads a commit proposal the way a procurement lead would: it flags the exclusions, the shortfall terms and the ramp you were not offered, and drafts the email that asks for them.

**[Analyze your cloud proposal](/try)**
`,
  },
  {
    slug: 'marketing-agency-retainer-clauses-to-fix',
    title: 'Marketing agency retainer: 7 clauses to fix before you sign',
    description: 'Agency retainers are written by agencies. Here are the seven terms that quietly cost you money, from media markup to who owns the creative, and what to ask for on each.',
    date: '2026-08-26',
    readTime: '7 min read',
    category: 'Marketing & Agencies',
    content: `
## The retainer is not the price. The retainer is the floor.

An agency proposal usually lands as a clean number: a monthly retainer, a scope, a team. The number looks fine. The money leaks elsewhere: in markups you did not see, in out-of-scope work billed by the hour, in a notice period that costs you three months when you want to leave.

Agency contracts are written by agencies. That is not sinister. It just means the defaults favour them. Here are the seven clauses to fix before you sign.

---

## 1. Media and production markup

If the agency buys media, tools, printing, influencers or freelancers on your behalf, most contracts add a markup, commonly 10 to 20 percent. On a $40k monthly media budget, a 15 percent markup is $72k a year that is not buying anything.

**What to look for:**
- Whether pass-through costs are billed "at cost" or "plus a handling fee"
- Whether the markup applies to ad platform spend (Meta, Google, LinkedIn) or only to third-party vendors
- Whether you can pay platforms directly from your own accounts

**What to ask:** "Media spend runs through our own ad accounts, billed direct. Third-party costs are passed through at cost, with any markup capped at 5 percent and itemised."

---

## 2. Scope, defined by output, not hours

"Ongoing marketing support" is not a scope. Vague scope leads to two outcomes, both bad: either the agency under-delivers and points at the contract, or everything becomes a change request billed on top.

**What to ask:** "Define the retainer as deliverables per month: number of campaigns, assets, reports, meetings. Anything beyond that is quoted in advance and approved in writing before work starts."

---

## 3. Who owns the work

Many agency contracts keep ownership of creative, strategy documents, or even the ad accounts until the final invoice is paid, and some keep it after. If you leave, you lose the assets you paid for.

**What to look for:**
- IP assignment on delivery versus on final payment
- Ownership of ad accounts, analytics properties, landing pages and domains
- Rights to source files, not only exports

**What to ask:** "All work product is assigned to us on payment of the invoice it relates to. Ad accounts, analytics and domains are created under our ownership from day one, with the agency as a user."

---

## 4. Notice period and minimum term

A 12-month minimum term with 90 days' notice means the cheapest exit is 15 months. Agencies argue they need runway. That is fair for the first quarter, and unnecessary after.

**What to ask:** "Three-month initial term, then rolling monthly with 30 days' notice. If a minimum term is required, pair it with a performance clause."

---

## 5. A performance clause you can actually use

Agencies resist guarantees, and they are right to: outcomes depend on your product and budget. What you can ask for is a review gate. Agree two or three metrics at the start, review at 90 days, and give either side the right to exit without penalty if the numbers are not moving.

**What to ask:** "At day 90 we review against the agreed metrics. If two of three are below target, either party may terminate with 30 days' notice and no early-termination fee."

---

## 6. The team you were sold

The pitch is delivered by the senior team. The work is delivered by whoever is available. Contracts rarely name people, so there is nothing to hold the agency to.

**What to ask:** "Name the account lead and the senior strategist in the contract. Replacing either requires our written approval and a four-week overlap."

---

## 7. Rate card for out-of-scope work

Even with a clear scope, extra work will come up. If there is no rate card in the contract, every change request is priced on the day, from a position of strength.

**What to ask:** "Attach an hourly rate card by role, fixed for the term. Out-of-scope work is estimated against it and approved before it starts."

---

## The bottom line

The retainer number is the part of an agency deal that gets negotiated. The markup, the scope, the IP and the exit are the parts that decide what you actually pay. Fix those seven clauses and the retainer becomes what it should be: a predictable fee for a defined output, with a clean door out.

TermLift reads an agency proposal for exactly these clauses, prices what each one is costing you, and drafts the email that asks for the fix.

**[Analyze your agency proposal](/try)**
`,
  },
  {
    slug: 'how-to-negotiate-msp-it-support-contract',
    title: 'How to negotiate an MSP contract: per-user pricing, SLAs and the exit',
    description: 'Managed IT contracts are built to renew quietly for years. Here is what to check on pricing, service levels and offboarding before you sign or renew with an MSP.',
    date: '2026-08-19',
    readTime: '7 min read',
    category: 'IT & Infrastructure',
    content: `
## The MSP contract is designed to outlast the people who signed it.

Managed service providers run your helpdesk, your endpoints, your backups and often your licensing. The contract is usually three years, auto-renews, and is priced per user or per device. Nobody reads it after year one, which is exactly the point.

Whether you are signing a new MSP or renewing one, here is what to check.

---

## 1. Per-user pricing: count the users, then count the definition

Per-user pricing looks simple until you read how "user" is defined. Shared mailboxes, contractors, service accounts and former employees with a lingering licence can all count.

**What to look for:**
- The definition of a billable user in the contract, not in the proposal
- Whether the count is fixed at signature or trued up monthly, and in which direction
- Minimum user commitments that stay flat when your headcount drops

**The math matters.** At $120 per user per month, ten stale accounts is $14,400 a year. A minimum commitment of 100 users when you have 80 is $28,800 a year for nothing.

**What to ask:** "Billable users are defined as active named employees. The count is trued up monthly in both directions, with no minimum above 80 percent of the initial count."

---

## 2. What is in the base fee and what is billed on top

The base fee covers "support". Projects, after-hours work, onboarding new sites, hardware installs and anything the MSP calls "professional services" are usually billed separately, at rates set in a schedule you did not negotiate.

**What to ask:** "List every service that is billed outside the base fee, with its rate, in the contract. Include a monthly bank of 10 project hours in the base fee."

---

## 3. SLAs with credits, not SLAs with apologies

Most MSP contracts include response and resolution targets. Fewer include what happens when they are missed. An SLA without a credit is a description, not a commitment.

**What to look for:**
- Response versus resolution targets, by priority level
- Whether targets apply 24/7 or business hours only
- Service credits: how much, how they are claimed, and whether they are automatic

**What to ask:** "P1 response within 15 minutes, resolution within 4 hours, 24/7. Missed targets earn a 5 percent credit on that month's fee, applied automatically without a claim."

---

## 4. Hardware and licensing markup

Many MSPs resell hardware and Microsoft or Google licensing. The convenience is real. So is the margin, often 10 to 25 percent above what you would pay direct or through a distributor.

**What to ask:** "We may procure hardware and licences directly or through a distributor of our choice. The MSP supports them under the same terms. Any resold item is priced with a disclosed markup, capped at 8 percent."

---

## 5. Auto-renewal and the notice window

The classic structure: 36-month term, auto-renews for 12 months, 90 days' notice required. If you miss the window by a day, you have bought another year.

**What to ask:** "Auto-renewal is removed. If renewal is retained, notice is 30 days and the MSP must send a written reminder 60 days before the deadline."

---

## 6. The exit: documentation, credentials and data

The most expensive part of an MSP contract is leaving it. If the MSP holds your admin credentials, your documentation and your backup encryption keys, offboarding happens on their terms and their timeline.

**What to look for:**
- Who owns admin accounts for Microsoft 365, Google Workspace, firewalls and backups
- Whether network and system documentation is yours, and kept current
- Transition assistance: how many hours, at what rate, for how long after termination

**What to ask:** "All admin credentials are held in our own password vault with the MSP as a delegated user. Documentation is delivered quarterly. On termination, 40 hours of transition assistance are included at no charge within 60 days."

---

## 7. Price escalation

A 5 percent annual increase clause compounds to 16 percent over three years, before any change in scope. Many contracts also allow pass-through of vendor increases on top.

**What to ask:** "Fees are fixed for the initial term. Any increase at renewal is capped at CPI or 3 percent, whichever is lower, with 90 days' written notice."

---

## The bottom line

An MSP contract is a long relationship priced on a per-user number. The number is rarely the problem. The definitions, the exclusions, the missing credits and the exit are where it costs you. Get those right and the per-user rate takes care of itself.

TermLift reads an MSP proposal for every one of these clauses, shows what each is worth, and drafts the email that asks for the version you want.

**[Analyze your MSP proposal](/try)**
`,
  },
]

export const postsFr: BlogPost[] = [
  {
    slug: 'how-to-negotiate-cloud-commit-aws-azure-gcp',
    title: 'Négocier un engagement cloud (AWS, Azure, GCP) sans se surengager',
    description: "Les contrats d'engagement de dépenses achètent une remise avec votre propre prévision. Voici comment dimensionner l'engagement, ce que le commercial peut vraiment bouger, et les clauses qui vous protègent quand l'usage change.",
    date: '2026-09-02',
    readTime: '8 min de lecture',
    category: 'IT & Infrastructure',
    content: `
## La remise est réelle. Le piège aussi.

Tous les grands fournisseurs cloud vendent le même contrat : engagez-vous sur un montant fixe sur un à trois ans et obtenez un pourcentage de remise. AWS l'appelle EDP ou Private Pricing Agreement, Azure l'appelle MACC, Google l'appelle Commit Agreement. La mécanique est assez proche pour la traiter comme une seule négociation.

L'argument est simple. Vous dépensez déjà cet argent, pourquoi ne pas obtenir 10 à 20 % de remise ? Le problème tient dans le mot « engagement ». Si vous dépensez moins que le montant signé, vous payez quand même le montant signé.

Voici comment obtenir la remise sans acheter votre propre erreur de prévision.

---

## 1. Dimensionnez l'engagement sur ce que vous dépenserez, pas sur ce que vous espérez

Le commercial vous demandera votre prévision, puis proposera un engagement légèrement au-dessus. C'est à l'envers. Votre engagement doit se situer sous votre plancher certain, pas à votre objectif.

**Ce qu'il faut vérifier :**
- Vos 12 derniers mois de dépenses réelles, mois par mois, pas le total annuel
- Les charges de travail prévues pour quitter la plateforme, être réarchitecturées ou arrêtées
- Si un gros projet ponctuel a gonflé le chiffre de l'an dernier

**Le calcul compte.** Si vous dépensez 1,2 M$ par an aujourd'hui et vous engagez sur 1,5 M$ pendant trois ans avec 15 % de remise, il vous faut 25 % de croissance chaque année rien que pour rentabiliser l'engagement. Ratez-le une fois et le manque est facturé en totalité, généralement au dernier trimestre.

**Ce qu'il faut demander :** « Nous nous engageons sur 1,1 M$ par an. Montrez-nous la remise à ce niveau, et séparément à 1,3 M$, pour voir ce que l'engagement supplémentaire achète réellement. »

---

## 2. Obtenez une rampe de croissance, pas un chiffre plat

Un engagement plat sur trois ans suppose que l'année un et l'année trois se ressemblent. Ce n'est jamais le cas. Les fournisseurs peuvent structurer l'engagement en rampe, avec un montant plus bas la première année et plus haut la troisième. La plupart des commerciaux ne le proposent pas sauf si vous le demandez.

**Ce qu'il faut demander :** « Structurez l'engagement en rampe : 900 k$ en année un, 1,1 M$ en année deux, 1,3 M$ en année trois. Même total, même palier de remise. »

Si le commercial répond que le palier dépend du montant annuel, demandez que le palier soit fixé sur la moyenne de la période.

---

## 3. Vérifiez ce qui compte dans l'engagement

Tous les dollars dépensés ne comptent pas. Les achats sur la marketplace, les frais de support, certains services tiers et certaines régions sont exclus par défaut dans beaucoup d'accords. Si 20 % de votre facture ne compte pas, votre engagement effectif vient d'augmenter de 25 %.

**Ce qu'il faut vérifier :**
- Si les dépenses marketplace comptent, et jusqu'à quel pourcentage
- Si les plans de support comptent
- Si les dépenses des filiales ou des comptes séparés sont consolidées

**Ce qu'il faut demander :** « Confirmez par écrit que la marketplace, le support et tous les comptes liés comptent dans l'engagement. »

---

## 4. Négociez la clause de manque avant d'en avoir besoin

Chaque accord d'engagement prévoit ce qui se passe si vous sous-consommez. Par défaut, vous payez la différence. Les bonnes versions permettent de reporter un manque sur une prolongation, ou de l'imputer sur l'accord suivant.

**Ce qu'il faut demander :** « Ajoutez une clause de manque : si nous sommes en dessous de moins de 15 % en fin de période, le solde est reporté sur une prolongation de 12 mois au même tarif plutôt que facturé. »

C'est la clause qui rend un engagement sûr à signer. Un commercial qui la refuse vous dit ce qu'il s'attend à voir arriver.

---

## 5. La remise n'est pas le seul levier

Le pourcentage de remise est le chiffre que tout le monde négocie, donc celui avec le moins de marge. Les autres leviers en ont généralement davantage.

**Ce qui coûte moins au fournisseur qu'un point de remise et vaut plus pour vous :**
- Des crédits de migration ou de preuve de concept, souvent 25 à 100 k$
- Un niveau de support supérieur inclus, ou à prix fixe plutôt qu'en pourcentage des dépenses
- Des crédits de formation et des revues d'architecture
- Une protection tarifaire sur les services dont vous dépendez
- Un technical account manager nommé

**Ce qu'il faut demander :** « Gardez la remise à 12 % et ajoutez 50 k$ de crédits de migration plus le support Business à un forfait annuel fixe. »

---

## 6. Choisissez le moment de la signature

Les commerciaux cloud ont des trimestres, et leurs trimestres se terminent selon un schéma prévisible. Un engagement qui se conclut dans les deux dernières semaines d'un trimestre vaut plus pour le commercial qu'un qui se conclut dans les deux premières semaines du suivant.

Pas besoin de jouer. Il faut savoir quand la pression est de leur côté de la table, et s'assurer que vos validations internes sont prêtes à avancer dans cette fenêtre.

---

## L'essentiel

Un engagement cloud, c'est vous qui prêtez de la certitude au fournisseur contre une remise. Valorisez cette certitude correctement : engagez-vous sous votre plancher, en rampe, faites tout compter, et obtenez une clause de manque. Puis consacrez la négociation aux crédits et au support, là où le fournisseur a plus de marge.

TermLift lit une proposition d'engagement comme le ferait un responsable achats : il signale les exclusions, les conditions de manque et la rampe qu'on ne vous a pas proposée, et rédige l'e-mail qui les demande.

**[Analysez votre proposition cloud](/try)**
`,
  },
  {
    slug: 'marketing-agency-retainer-clauses-to-fix',
    title: "Contrat d'agence marketing : 7 clauses à corriger avant de signer",
    description: "Les contrats d'agence sont rédigés par les agences. Voici les sept clauses qui vous coûtent discrètement de l'argent, de la marge sur les médias à la propriété des créations, et ce qu'il faut demander sur chacune.",
    date: '2026-08-26',
    readTime: '7 min de lecture',
    category: 'Marketing & Agences',
    content: `
## Le forfait n'est pas le prix. Le forfait est le plancher.

Une proposition d'agence arrive généralement comme un chiffre propre : un forfait mensuel, un périmètre, une équipe. Le chiffre semble correct. L'argent fuit ailleurs : dans des marges que vous n'avez pas vues, dans du hors-périmètre facturé à l'heure, dans un préavis qui vous coûte trois mois quand vous voulez partir.

Les contrats d'agence sont rédigés par les agences. Ce n'est pas malhonnête. Cela signifie juste que les valeurs par défaut les favorisent. Voici les sept clauses à corriger avant de signer.

---

## 1. Marge sur les médias et la production

Si l'agence achète des médias, des outils, de l'impression, des influenceurs ou des freelances pour votre compte, la plupart des contrats ajoutent une marge, couramment 10 à 20 %. Sur un budget média de 40 k$ par mois, une marge de 15 % représente 72 k$ par an qui n'achètent rien.

**Ce qu'il faut vérifier :**
- Si les coûts refacturés sont « au coût » ou « plus frais de gestion »
- Si la marge s'applique aux dépenses sur les plateformes (Meta, Google, LinkedIn) ou seulement aux prestataires tiers
- Si vous pouvez payer les plateformes directement depuis vos propres comptes

**Ce qu'il faut demander :** « Les dépenses médias passent par nos propres comptes publicitaires, facturées en direct. Les coûts tiers sont refacturés au coût, avec toute marge plafonnée à 5 % et détaillée. »

---

## 2. Un périmètre défini par les livrables, pas par les heures

« Accompagnement marketing continu » n'est pas un périmètre. Un périmètre flou mène à deux issues, toutes deux mauvaises : soit l'agence sous-livre et pointe le contrat, soit tout devient une demande de changement facturée en plus.

**Ce qu'il faut demander :** « Définissez le forfait en livrables par mois : nombre de campagnes, d'assets, de rapports, de réunions. Tout ce qui dépasse est chiffré à l'avance et validé par écrit avant le début du travail. »

---

## 3. Qui possède le travail

Beaucoup de contrats d'agence conservent la propriété des créations, des documents de stratégie, voire des comptes publicitaires jusqu'au paiement de la dernière facture, et certains après. Si vous partez, vous perdez les actifs que vous avez payés.

**Ce qu'il faut vérifier :**
- Cession de propriété intellectuelle à la livraison ou au paiement final
- Propriété des comptes publicitaires, propriétés analytics, landing pages et domaines
- Droits sur les fichiers sources, pas seulement les exports

**Ce qu'il faut demander :** « Tout le travail produit nous est cédé au paiement de la facture correspondante. Comptes publicitaires, analytics et domaines sont créés sous notre propriété dès le premier jour, avec l'agence comme utilisateur. »

---

## 4. Préavis et durée minimale

Une durée minimale de 12 mois avec 90 jours de préavis signifie que la sortie la moins chère est à 15 mois. Les agences disent qu'elles ont besoin de visibilité. C'est juste pour le premier trimestre, et inutile ensuite.

**Ce qu'il faut demander :** « Période initiale de trois mois, puis reconduction mensuelle avec 30 jours de préavis. Si une durée minimale est exigée, associez-la à une clause de performance. »

---

## 5. Une clause de performance réellement utilisable

Les agences refusent les garanties, et elles ont raison : les résultats dépendent de votre produit et de votre budget. Ce que vous pouvez demander, c'est un point de passage. Convenez de deux ou trois indicateurs au départ, faites le point à 90 jours, et donnez à chaque partie le droit de sortir sans pénalité si les chiffres ne bougent pas.

**Ce qu'il faut demander :** « À J+90, nous faisons le point sur les indicateurs convenus. Si deux sur trois sont sous l'objectif, chaque partie peut résilier avec 30 jours de préavis et sans frais de résiliation anticipée. »

---

## 6. L'équipe qu'on vous a vendue

Le pitch est présenté par l'équipe senior. Le travail est livré par qui est disponible. Les contrats nomment rarement des personnes, donc rien ne tient l'agence.

**Ce qu'il faut demander :** « Nommez le responsable de compte et le stratège senior dans le contrat. Remplacer l'un ou l'autre nécessite notre accord écrit et quatre semaines de recouvrement. »

---

## 7. Une grille tarifaire pour le hors-périmètre

Même avec un périmètre clair, du travail supplémentaire arrivera. Sans grille tarifaire dans le contrat, chaque demande de changement est chiffrée le jour même, en position de force.

**Ce qu'il faut demander :** « Annexez une grille horaire par rôle, fixe pour la durée du contrat. Le hors-périmètre est estimé sur cette base et validé avant de commencer. »

---

## L'essentiel

Le montant du forfait est la partie du contrat d'agence qui se négocie. La marge, le périmètre, la propriété intellectuelle et la sortie sont les parties qui décident de ce que vous payez vraiment. Corrigez ces sept clauses et le forfait devient ce qu'il doit être : une redevance prévisible pour un livrable défini, avec une porte de sortie propre.

TermLift lit une proposition d'agence pour exactement ces clauses, chiffre ce que chacune vous coûte, et rédige l'e-mail qui demande la correction.

**[Analysez votre proposition d'agence](/try)**
`,
  },
  {
    slug: 'how-to-negotiate-msp-it-support-contract',
    title: 'Négocier un contrat d\'infogérance : prix par utilisateur, SLA et sortie',
    description: "Les contrats d'infogérance sont conçus pour se reconduire discrètement pendant des années. Voici ce qu'il faut vérifier sur les tarifs, les niveaux de service et la réversibilité avant de signer ou de renouveler avec un MSP.",
    date: '2026-08-19',
    readTime: '7 min de lecture',
    category: 'IT & Infrastructure',
    content: `
## Le contrat d'infogérance est conçu pour survivre à ceux qui l'ont signé.

Les prestataires d'infogérance (MSP) gèrent votre helpdesk, vos postes, vos sauvegardes et souvent vos licences. Le contrat dure généralement trois ans, se reconduit tacitement, et est facturé par utilisateur ou par équipement. Personne ne le relit après la première année, ce qui est exactement le but.

Que vous signiez avec un nouveau MSP ou renouveliez avec l'actuel, voici ce qu'il faut vérifier.

---

## 1. Prix par utilisateur : comptez les utilisateurs, puis lisez la définition

Le prix par utilisateur semble simple jusqu'à ce qu'on lise comment « utilisateur » est défini. Boîtes partagées, prestataires, comptes de service et anciens salariés avec une licence oubliée peuvent tous compter.

**Ce qu'il faut vérifier :**
- La définition d'un utilisateur facturable dans le contrat, pas dans la proposition
- Si le nombre est figé à la signature ou ajusté chaque mois, et dans quel sens
- Les engagements minimaux qui restent fixes quand votre effectif baisse

**Le calcul compte.** À 120 $ par utilisateur et par mois, dix comptes obsolètes représentent 14 400 $ par an. Un engagement minimal de 100 utilisateurs quand vous en avez 80, c'est 28 800 $ par an pour rien.

**Ce qu'il faut demander :** « Les utilisateurs facturables sont les salariés nommés actifs. Le nombre est ajusté chaque mois dans les deux sens, sans minimum au-dessus de 80 % du nombre initial. »

---

## 2. Ce qui est dans le forfait et ce qui est facturé en plus

Le forfait couvre le « support ». Les projets, les interventions hors horaires, l'intégration de nouveaux sites, les installations matérielles et tout ce que le MSP appelle « prestations professionnelles » sont généralement facturés à part, à des tarifs fixés dans une annexe que vous n'avez pas négociée.

**Ce qu'il faut demander :** « Listez dans le contrat chaque prestation facturée hors forfait, avec son tarif. Incluez une banque mensuelle de 10 heures de projet dans le forfait. »

---

## 3. Des SLA avec pénalités, pas des SLA avec des excuses

La plupart des contrats MSP incluent des objectifs de réponse et de résolution. Moins nombreux sont ceux qui prévoient ce qui se passe quand ils sont manqués. Un SLA sans pénalité est une description, pas un engagement.

**Ce qu'il faut vérifier :**
- Objectifs de réponse et de résolution, par niveau de priorité
- Si les objectifs s'appliquent 24/7 ou seulement aux heures ouvrées
- Les crédits de service : combien, comment les réclamer, et s'ils sont automatiques

**Ce qu'il faut demander :** « P1 : réponse en 15 minutes, résolution en 4 heures, 24/7. Tout objectif manqué donne droit à un crédit de 5 % sur la redevance du mois, appliqué automatiquement sans réclamation. »

---

## 4. Marge sur le matériel et les licences

Beaucoup de MSP revendent du matériel et des licences Microsoft ou Google. La commodité est réelle. La marge aussi, souvent 10 à 25 % au-dessus du prix direct ou distributeur.

**Ce qu'il faut demander :** « Nous pouvons acheter le matériel et les licences directement ou via le distributeur de notre choix. Le MSP les supporte aux mêmes conditions. Tout article revendu est tarifé avec une marge déclarée, plafonnée à 8 %. »

---

## 5. Reconduction tacite et fenêtre de préavis

La structure classique : 36 mois, reconduction tacite de 12 mois, préavis de 90 jours. Ratez la fenêtre d'un jour et vous avez acheté une année de plus.

**Ce qu'il faut demander :** « La reconduction tacite est supprimée. Si elle est maintenue, le préavis est de 30 jours et le MSP doit envoyer un rappel écrit 60 jours avant l'échéance. »

---

## 6. La sortie : documentation, identifiants et données

La partie la plus coûteuse d'un contrat MSP, c'est d'en sortir. Si le MSP détient vos identifiants administrateur, votre documentation et vos clés de chiffrement de sauvegarde, la réversibilité se fait à ses conditions et à son rythme.

**Ce qu'il faut vérifier :**
- Qui possède les comptes administrateur de Microsoft 365, Google Workspace, des pare-feu et des sauvegardes
- Si la documentation réseau et système vous appartient, et est tenue à jour
- L'assistance de transition : combien d'heures, à quel tarif, pendant combien de temps après la résiliation

**Ce qu'il faut demander :** « Tous les identifiants administrateur sont conservés dans notre propre coffre de mots de passe, le MSP étant utilisateur délégué. La documentation est livrée chaque trimestre. À la résiliation, 40 heures d'assistance de transition sont incluses sans frais dans les 60 jours. »

---

## 7. Indexation des prix

Une clause d'augmentation annuelle de 5 % compose à 16 % sur trois ans, avant tout changement de périmètre. Beaucoup de contrats autorisent en plus la répercussion des hausses des éditeurs.

**Ce qu'il faut demander :** « Les redevances sont fixes pour la période initiale. Toute augmentation au renouvellement est plafonnée à l'inflation ou 3 %, la valeur la plus basse s'appliquant, avec 90 jours de préavis écrit. »

---

## L'essentiel

Un contrat d'infogérance est une relation longue, tarifée sur un prix par utilisateur. Le prix est rarement le problème. Les définitions, les exclusions, les pénalités absentes et la sortie sont ce qui vous coûte. Réglez cela et le prix par utilisateur se règle tout seul.

TermLift lit une proposition d'infogérance pour chacune de ces clauses, montre ce que chacune vaut, et rédige l'e-mail qui demande la version que vous voulez.

**[Analysez votre proposition d'infogérance](/try)**
`,
  },
]
