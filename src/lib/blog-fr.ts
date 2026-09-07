import type { BlogPost } from './blog'

export const blogPostsFr: BlogPost[] = [
  {
    slug: 'how-to-negotiate-saas-renewal',
    title: 'Comment négocier le renouvellement de votre contrat SaaS (et arrêter de surpayer)',
    description: 'La plupart des renouvellements SaaS passent sans la moindre contestation. Voici ce qu\'il faut vérifier, ce qu\'il faut demander, et comment rédiger l\'e-mail qui vous obtient de meilleures conditions.',
    date: '2026-03-15',
    readTime: '7 min de lecture',
    category: 'SaaS',
    content: `
## Vous êtes sur le point de renouveler. Votre fournisseur compte sur le fait que vous ne direz rien.

La plupart des renouvellements SaaS se font en pilote automatique. L'e-mail arrive, la facture suit, et quelqu'un signe. Sans poser de questions.

Le problème ? Votre fournisseur ne facture pas au prix plancher. Il facture au prix qu'il pense que vous accepterez. Et chaque année où vous renouvelez sans broncher, cet écart se creuse.

Voici ce qu'il faut vérifier avant de signer, et comment obtenir de meilleures conditions en un seul e-mail.

---

## 1. Vérifiez le nombre de licences

C'est la première source de gaspillage dans les contrats SaaS. Consultez vos données d'utilisation réelles et comparez-les à ce que vous payez.

**Ce qu'il faut chercher :**
- Combien de licences sont souscrites par rapport au nombre de personnes qui se connectent réellement ?
- Y a-t-il d'anciens employés qui occupent encore des licences ?
- Avez-vous des licences « tampon » ajoutées lors d'une phase de recrutement qui n'a jamais abouti ?

**Les chiffres parlent.** Si vous payez 40 licences à $75/mois mais que seulement 28 personnes se connectent, ce sont 12 licences inutilisées qui vous coûtent $10,800/an. Réajuster à 32 (28 actifs + 4 en réserve) vous fait économiser $7,200 immédiatement.

**Ce qu'il faut demander :** « Nous souhaitons réajuster notre nombre de licences de [actuel] à [cible]. Pouvez-vous adapter le renouvellement en conséquence ? »

---

## 2. Examinez les conditions de renouvellement

Les clauses de renouvellement automatique sont le tueur silencieux de votre pouvoir de négociation. Vérifiez ces points :

- **Délai de préavis :** Combien de jours avant le renouvellement devez-vous notifier votre décision ? 30 jours, c'est serré. 90 jours, c'est restrictif. Si vous manquez la fenêtre, vous êtes engagé pour une année supplémentaire au tarif fixé par le fournisseur.
- **Clause d'augmentation :** Le contrat prévoit-il des hausses annuelles ? Beaucoup de contrats SaaS incluent des clauses d'augmentation de 5 à 10 % par an. Sur 3 ans, cela s'accumule rapidement.
- **Engagement :** Pouvez-vous réduire votre forfait en cours de contrat ? La plupart des fournisseurs refusent. Vous ne pouvez réduire vos licences qu'au moment du renouvellement.

**Ce qu'il faut demander :** « Pouvons-nous allonger le délai de préavis de renouvellement automatique à 60 jours et plafonner les augmentations annuelles à 3 % ? »

---

## 3. Demandez une remise fidélité ou volume

Si vous êtes client depuis plus de 12 mois, vous avez un levier. La rétention coûte moins cher que l'acquisition pour tout fournisseur SaaS, et leurs responsables de compte ont généralement l'autorité pour proposer des remises de 8 à 15 % au renouvellement.

**Le point clé :** Cette remise n'est presque jamais proposée spontanément. Il faut la demander.

**Ce qui fonctionne :**
- « Nous sommes clients depuis [X] ans. Y a-t-il une remise fidélité pour les renouvellements ? »
- « Nous évaluons d'autres solutions. Une remise de 10 % sur ce renouvellement simplifierait notre décision. »
- « Nous nous engagerions sur 2 ans en échange d'une remise annuelle de 8 %. »

**Ce qui ne fonctionne pas :**
- Menacer de partir sans avoir de véritable alternative
- Demander plus de 20 % de réduction (irréaliste pour la plupart des SaaS)
- Rester vague : « Pouvez-vous faire un effort sur le prix ? »

---

## 4. Vérifiez ce que vous utilisez vraiment

Les fournisseurs SaaS adorent les offres groupées. Vous payez peut-être des modules, des fonctionnalités ou des niveaux de service que vous n'utilisez pas.

**Gaspillages fréquents :**
- Un niveau de support premium alors que le support standard suffit
- Des analyses avancées que personne ne consulte
- Un accès API que votre équipe n'exploite pas
- Des fonctionnalités de sécurité entreprise sur un forfait équipe

**Ce qu'il faut demander :** « Pouvons-nous passer au niveau [inférieur] et bénéficier de la différence ? Nous n'utilisons que [fonctionnalités spécifiques]. »

---

## 5. Rédigez l'e-mail

C'est l'étape que la plupart des gens sautent. Vous savez quoi demander, mais rédiger l'e-mail vous semble délicat. Ça ne devrait pas. Les fournisseurs s'attendent à une négociation. Un e-mail poli, clair, avec des demandes précises suffit.

**Un modèle qui fonctionne :**

> Bonjour [Nom],
>
> Merci pour l'avis de renouvellement. Nous comptons poursuivre et souhaitons finaliser cela rapidement.
>
> Avant de signer, quelques points que j'aimerais régler :
>
> 1. Nous avons actuellement [X] licences mais seulement [Y] sont actives. Serait-il possible de réajuster à [Z] ?
> 2. Nous sommes clients depuis [N] ans. Y a-t-il une possibilité de remise fidélité ?
> 3. Le délai de préavis pour le renouvellement automatique est court. Serait-il possible de l'allonger à 60 jours ?
>
> Si nous pouvons nous entendre sur ces points, je suis prêt à signer cette semaine.
>
> Cordialement,
> [Votre Nom]

**Pourquoi ça fonctionne :** C'est précis, c'est raisonnable, et cela donne au fournisseur une raison de dire oui (vous êtes prêt à signer immédiatement).

---

## 6. Sachez quand vous retirer

Toute négociation n'aboutit pas. Si le fournisseur ne bouge pas sur le prix, regardez les conditions à la place :

- Gel des tarifs pour 2 ans
- Engagement plus court (mensuel au lieu d'annuel)
- Allongement du délai de préavis
- Report des licences non utilisées
- Formation ou intégration gratuite pour les nouveaux utilisateurs

Parfois, la meilleure offre n'est pas la moins chère. C'est celle qui offre le plus de flexibilité.

---

## L'essentiel

Les renouvellements SaaS ne sont pas à prendre ou à laisser. Chaque fournisseur a de la marge, chaque contrat a du jeu, et chaque acheteur qui négocie obtient de meilleures conditions que celui qui ne le fait pas.

La différence entre une bonne affaire et une mauvaise tient à ce que vous savez demander. C'est exactement ce que fait TermLift : collez votre devis de renouvellement, récupérez chaque signal d'alerte, chaque opportunité d'économie, et un e-mail prêt à envoyer en quelques minutes.

**[Analysez votre devis](/try)**
`,
  },
  {
    slug: '5-things-vendor-hopes-you-wont-notice',
    title: '5 pièges que votre fournisseur espère que vous ne remarquerez pas dans son devis',
    description: 'Les fournisseurs ne cachent pas les mauvaises conditions. Ils les rendent simplement faciles à manquer. Voici les cinq pièges les plus courants dans les devis fournisseurs et comment les repérer avant de signer.',
    date: '2026-03-05',
    readTime: '6 min de lecture',
    category: 'Négociation',
    content: `
## Les fournisseurs ne cachent pas les mauvaises conditions. Ils les rendent simplement faciles à manquer.

Personne n'écrit « nous vous facturerons plus cher chaque année » en gros caractères rouges. À la place, cela apparaît sous la forme « tarification susceptible de révision annuelle » au paragraphe 8 des conditions générales. Parfaitement légal. Parfaitement évitable si vous savez où regarder.

Voici les cinq pièges les plus courants dans les devis fournisseurs, et ce qu'il faut faire pour chacun.

---

## 1. Le piège du renouvellement automatique

**À quoi ça ressemble :** « Le présent contrat sera automatiquement reconduit pour des périodes successives de 12 mois sauf notification écrite au moins 30 jours avant la date de renouvellement. »

**Pourquoi c'est important :** Manquez cette fenêtre de 30 jours et vous êtes engagé pour une année supplémentaire au tarif décidé par le fournisseur. Et la plupart des fournisseurs comptent sur le fait que vous la manquerez.

**Ce qu'il faut faire :**
- Allonger le délai de préavis à au moins 60 jours
- Programmer un rappel dans votre agenda 90 jours avant le renouvellement
- Demander un renouvellement sur accord explicite plutôt qu'un renouvellement automatique
- Au minimum, demander un rappel par e-mail avant la clôture de la fenêtre

---

## 2. La clause d'augmentation tarifaire

**À quoi ça ressemble :** « La tarification est susceptible de révision annuelle et peut augmenter jusqu'à 8 % à chaque renouvellement. »

**Pourquoi c'est important :** Une augmentation annuelle de 8 % sur un contrat à $50,000 signifie que vous payez $58,320 en année 2 et $62,986 en année 3. C'est $21,306 de plus sur 3 ans par rapport à un tarif gelé.

**Ce qu'il faut faire :**
- Demander un gel des tarifs pour toute la durée du contrat
- Si le fournisseur insiste sur une clause d'augmentation, la plafonner à 3 % ou à l'indice des prix à la consommation
- Proposer un engagement pluriannuel en échange d'un gel tarifaire
- Au minimum, vérifier que le plafond existe avant de signer

---

## 3. Le tour de l'offre groupée

**À quoi ça ressemble :** Une seule ligne intitulée « Offre Entreprise » à $2,400/mois sans aucun détail de ce qui est inclus.

**Pourquoi c'est important :** Sans détail, vous ne pouvez pas savoir si vous payez pour des fonctionnalités que vous n'utilisez pas. Vous ne pouvez pas non plus négocier les composantes individuellement. Le fournisseur le sait bien.

**Ce qu'il faut faire :**
- Demander un détail ligne par ligne de chaque composante
- Identifier les fonctionnalités que vous utilisez réellement
- Demander le retrait ou le déclassement des composantes inutiles
- Comparer les tarifs par composante avec ceux de solutions alternatives

---

## 4. Le problème des licences inutilisées

**À quoi ça ressemble :** 40 licences souscrites sur un contrat SaaS au poste. Coût mensuel : $3,000.

**Ce que vous ne voyez pas :** Seulement 28 personnes se connectent réellement. Les 12 autres licences concernent d'anciens employés, des réserves inutilisées, ou des postes ajoutés lors d'une phase de recrutement qui n'a pas abouti.

**Le coût :** 12 licences à $75/mois = $900/mois = $10,800/an jetés par la fenêtre.

**Ce qu'il faut faire :**
- Consulter vos données d'utilisation réelles avant chaque renouvellement
- Réajuster au nombre d'utilisateurs actifs plus une petite marge (10-15 %)
- Demander si les licences inutilisées peuvent être suspendues plutôt que facturées
- Programmer un bilan d'utilisation trimestriel

---

## 5. Le flou du périmètre

**À quoi ça ressemble :** « Services professionnels selon les besoins » ou « support inclus » sans définition de ce que cela couvre réellement.

**Pourquoi c'est important :** Un périmètre vague est une porte ouverte aux frais supplémentaires. « Selon les besoins » peut signifier 5 heures comme 50 heures, et vous ne le saurez qu'à la réception de la facture. Le fournisseur n'a aucune raison de clarifier tant que vous ne le demandez pas.

**Ce qu'il faut faire :**
- Obtenir des livrables précis avec des quantités (heures, sessions, rapports)
- Ajouter un plafond pour les travaux hors périmètre avec validation préalable obligatoire
- Définir ce qui est inclus par rapport à ce qui génère des frais supplémentaires
- Si le fournisseur dit « on verra au fil de l'eau », c'est un signal d'alerte

---

## Le schéma récurrent

Remarquez ce que ces cinq pièges ont en commun : ils ne sont pas dissimulés. Ils figurent noir sur blanc dans le devis. Le fournisseur les rend simplement faciles à survoler.

Un professionnel des achats repérerait ces cinq points en quelques minutes. Mais la plupart des personnes qui signent des contrats fournisseurs ne sont pas des professionnels des achats. Ce sont des dirigeants, des responsables opérationnels et des entrepreneurs qui ont cent autres priorités.

C'est pourquoi nous avons créé TermLift. Collez votre devis et l'outil signale automatiquement chacun de ces pièges, avec des recommandations précises sur ce qu'il faut demander.

**[Analysez votre devis](/try)**
`,
  },
  {
    slug: 'how-to-review-vendor-contract-without-lawyer',
    title: 'Comment analyser un contrat fournisseur sans avocat',
    description: 'Pas besoin d\'un diplôme en droit pour repérer les mauvaises conditions. Voici les 7 clauses qui comptent le plus dans un contrat fournisseur et ce qu\'il faut contester.',
    date: '2026-03-10',
    readTime: '7 min de lecture',
    category: 'Contrats',
    content: `
## Vous n'avez pas besoin d'un avocat. Vous devez savoir où regarder.

La plupart des contrats fournisseurs sont composés à 80 % de clauses standards et à 20 % de conditions qui affectent réellement votre budget, votre flexibilité et vos risques. Le problème, c'est de savoir quels 20 % comptent.

Voici les 7 clauses à vérifier dans tout contrat fournisseur, et ce qu'il faut exactement contester.

---

## 1. Renouvellement automatique et délai de préavis

**Où la trouver :** Généralement vers la fin, dans la section « Durée » ou « Renouvellement ».

**Ce qu'elle dit habituellement :** « Le présent contrat sera automatiquement reconduit pour des périodes successives de 12 mois sauf notification écrite au moins 30 jours avant la date de renouvellement. »

**Pourquoi c'est important :** Manquez le délai de préavis et vous êtes engagé pour une année supplémentaire. Un délai de 30 jours sur un contrat à 50,000, c'est agressif.

**Ce qu'il faut demander :**
- Un délai de préavis de 60 à 90 jours
- Un renouvellement sur accord explicite plutôt qu'automatique
- Une notification par e-mail du fournisseur 90 jours avant le renouvellement
- Au minimum, programmez immédiatement un rappel dans votre agenda

---

## 2. Droits d'augmentation tarifaire

**Où les trouver :** Dans la section « Tarification » ou « Honoraires ».

**Ce qu'ils disent habituellement :** « La tarification est susceptible de révision annuelle et peut augmenter jusqu'à [X] % à chaque période de renouvellement. »

**Pourquoi c'est important :** Une augmentation annuelle de 8 % sur un contrat à 30,000 signifie que vous payez 34,992 en année 3. C'est 15,000 de plus sur 3 ans par rapport à un tarif fixe.

**Ce qu'il faut demander :**
- Un plafonnement à 3 % ou à l'indice des prix à la consommation, le plus bas des deux
- Un gel des tarifs pour la durée initiale du contrat
- Une garantie tarifaire pluriannuelle en échange d'un engagement plus long

---

## 3. Droits de résiliation

**Où les trouver :** Dans la section « Résiliation » ou « Annulation ».

**Ce qu'ils disent habituellement :** « Chaque partie peut résilier avec un préavis écrit de [X] jours » ou parfois « Le présent contrat ne peut être résilié pendant la période initiale d'engagement ».

**Pourquoi c'est important :** Si vous ne pouvez pas sortir, vous n'avez aucun levier. Votre situation évolue. La qualité de service de votre fournisseur peut évoluer. Vous avez besoin d'une porte de sortie.

**Ce qu'il faut demander :**
- Une résiliation pour convenance avec un préavis de 60 à 90 jours
- Une résiliation pour manquement (le fournisseur ne respecte pas ses obligations) avec un préavis de 30 jours
- Un remboursement au prorata des sommes prépayées en cas de résiliation anticipée

---

## 4. Responsabilité et indemnisation

**Où les trouver :** Généralement dans la section juridique, souvent rédigée en langage dense.

**Ce qu'il faut chercher :** Le fournisseur plafonne-t-il sa responsabilité ? À quel niveau ?

**Pièges courants :**
- Responsabilité plafonnée aux « montants versés au cours des 12 derniers mois » (cela vous expose si le produit du fournisseur cause un préjudice réel)
- Indemnisation réciproque qui est en réalité unilatérale
- Exclusion des dommages indirects (le fournisseur n'est pas responsable de l'impact commercial de sa défaillance)

**Ce qu'il faut demander :**
- Un plafond de responsabilité correspondant au plus élevé des deux : 12 mois de redevances ou un montant forfaitaire raisonnable
- Des exceptions pour les violations de données et les atteintes à la propriété intellectuelle (pas de plafond sur ces points)
- Des obligations d'indemnisation équilibrées

---

## 5. Périmètre et livrables

**Où les trouver :** Dans la section « Services » ou « Périmètre des prestations ».

**Ce qu'il faut chercher :** Le périmètre est-il précis ou vague ?

**Signaux d'alerte :**
- « Prestations selon les besoins » ou « d'un commun accord »
- « Jusqu'à [X] heures » sans précision sur ce qui se passe au-delà
- Des livrables décrits en termes généraux sans quantités, délais ni critères de qualité

**Pourquoi c'est important :** Un périmètre vague est une invitation aux avenants, aux frais supplémentaires et aux litiges. Si le fournisseur dit « on s'adaptera au fur et à mesure », il prépare le terrain pour des coûts additionnels.

**Ce qu'il faut demander :**
- Des livrables précis avec quantités et délais
- Un plafond pour les travaux hors périmètre avec validation préalable obligatoire
- Une définition claire de ce qui est inclus par rapport à ce qui est facturé en supplément

---

## 6. Conditions de paiement

**Où les trouver :** Dans la section « Paiement » ou « Facturation ».

**Ce qu'il faut vérifier :**
- Quand le paiement est-il dû ? 30 jours nets, c'est la norme. 15 jours nets ou « à réception » avantage le fournisseur.
- Y a-t-il des pénalités de retard ? À quel pourcentage ?
- Payez-vous d'avance pour des prestations non encore réalisées ?

**Ce qu'il faut demander :**
- Paiement à 30 ou 60 jours nets à compter de la date de facturation
- Paiement lié à des jalons ou à la livraison, pas à des dates fixes
- Pas plus de 20 à 30 % d'acompte sur les projets importants

---

## 7. Données et propriété intellectuelle

**Où les trouver :** Dans la section « Propriété intellectuelle » ou « Données ».

**Ce qu'il faut vérifier :**
- Qui est propriétaire des livrables ? Si vous payez pour un développement sur mesure, ils doivent vous appartenir.
- Que deviennent vos données à la fin du contrat ? Sont-elles restituées, supprimées, ou retenues en otage ?
- Le fournisseur peut-il utiliser vos données à ses propres fins (analyses, entraînement de modèles, marketing) ?

**Ce qu'il faut demander :**
- La propriété de tous les livrables sur mesure vous revient
- Les données sont restituées ou supprimées de manière sécurisée dans les 30 jours suivant la fin du contrat
- Le fournisseur ne peut utiliser vos données à aucune fin autre que la fourniture du service

---

## Vous n'avez pas besoin d'un avocat pour cela

Ces 7 clauses couvrent 90 % de ce qui compte dans un contrat fournisseur. Un avocat apporte une vraie valeur ajoutée pour les opérations complexes, les fusions-acquisitions ou les structures de risque inhabituelles. Pour un contrat SaaS, de service ou de matériel standard, lire attentivement ces sections suffit.

TermLift analyse votre devis fournisseur et signale automatiquement tous ces problèmes, avec des recommandations précises sur ce qu'il faut demander et un e-mail de négociation prêt à envoyer.

**[Analysez votre devis](/try)**
`,
  },
  {
    slug: 'how-to-respond-to-vendor-price-increase',
    title: 'Comment répondre à une hausse de prix fournisseur (sans casser la relation)',
    description: 'Les hausses de prix fournisseur sont courantes, mais rarement définitives. Voici comment évaluer si la hausse est justifiée, quoi demander, et comment rédiger l\'e-mail de contestation.',
    date: '2026-03-28',
    readTime: '6 min de lecture',
    category: 'Négociation',
    content: `
## Votre fournisseur vient d'annoncer une hausse. Ce n'est pas une fatalité.

Chaque année, des milliers d'entreprises reçoivent un e-mail de leur fournisseur annonçant une « révision tarifaire ». La plupart acceptent sans broncher. Pourtant, selon les estimations du secteur, 60 à 70 % des hausses de prix fournisseurs sont négociables, en totalité ou en partie.

La clé : savoir quel type de hausse vous avez en face, évaluer sa légitimité, et formuler la bonne réponse.

---

## Pourquoi les fournisseurs augmentent leurs prix

Les raisons sont multiples, mais elles ne se valent pas toutes. Avant de répondre, identifiez la nature de la hausse.

### Les 3 types de hausse

**1. Hausse liée à l'inflation ou à l'IPC**

Le fournisseur invoque la hausse des coûts généraux : matières premières, énergie, salaires. C'est le type le plus courant et souvent le plus légitime.

**Comment la repérer :** Le fournisseur fait référence à l'indice des prix à la consommation, au coût des matières premières, ou à « l'évolution du marché ». La hausse se situe généralement entre 2 et 5 %.

**2. Hausse furtive**

Le prix unitaire reste identique, mais le périmètre diminue. Moins de licences incluses, support réduit, fonctionnalités déplacées vers un niveau supérieur. Vous payez le même montant pour moins de valeur.

**Comment la repérer :** Comparez le détail du nouveau devis avec l'ancien. Si des éléments ont disparu ou changé de niveau, c'est une hausse déguisée.

**3. Hausse opportuniste**

Aucune justification objective. Le fournisseur augmente parce qu'il pense que vous ne contesterez pas. C'est fréquent chez les fournisseurs en position dominante ou lorsque le coût de changement est élevé.

**Comment la repérer :** La hausse dépasse 5 %, sans référence à un indice, sans justification détaillée, et sans modification du périmètre.

---

## Comment évaluer si la hausse est justifiée

Avant de contester, faites vos vérifications :

**1. Comparez avec l'IPC réel.** Si l'inflation annuelle est à 2,5 % et que votre fournisseur demande 8 %, l'écart de 5,5 points nécessite une explication.

**2. Vérifiez les prix du marché.** Demandez 2 à 3 devis concurrents pour des prestations équivalentes. Si le marché est à 10 % en dessous du nouveau tarif, vous avez un argument solide.

**3. Analysez votre historique.** Avez-vous déjà subi des hausses les années précédentes ? Un fournisseur qui augmente de 5 % chaque année depuis 3 ans a cumulé 15,7 % de hausse. Sur un contrat à 60 000 par an, cela représente 9 420 de plus qu'au départ.

**4. Évaluez votre dépendance.** Plus le coût de changement est élevé, plus le fournisseur se permet d'augmenter. Mais cela ne signifie pas que vous devez accepter sans négocier.

---

## Quoi demander : les 4 options de réponse

Vous n'êtes pas limité à « oui » ou « non ». Voici vos options :

### 1. Plafonner la hausse

Acceptez le principe, mais limitez le montant. « Nous comprenons la nécessité d'un ajustement. Nous proposons un plafond à 3 %, en ligne avec l'IPC. »

**Quand l'utiliser :** La hausse est partiellement justifiée, mais le pourcentage est excessif.

### 2. Reporter la hausse

Demandez un délai de 6 mois avant l'application. Cela vous donne le temps de budgétiser et de comparer les alternatives.

**Quand l'utiliser :** La hausse arrive en milieu d'exercice ou sans préavis suffisant.

### 3. Négocier en contrepartie

Acceptez la hausse si le fournisseur améliore les conditions. Plus de licences, support étendu, gel tarifaire pour les 2 prochaines années, allongement du délai de préavis.

**Quand l'utiliser :** Le fournisseur ne bougera pas sur le prix, mais vous pouvez obtenir de la valeur en échange.

### 4. Refuser et engager un appel d'offres

Si la hausse est injustifiée et que le fournisseur refuse de négocier, mettez le contrat en concurrence. Même si vous ne changez pas, l'exercice produit des données de marché qui renforcent votre position.

**Quand l'utiliser :** La hausse dépasse 10 %, le fournisseur ne justifie rien, et des alternatives crédibles existent.

---

## Comment écrire l'e-mail de contestation

> Bonjour [Nom],
>
> Merci pour l'avis de révision tarifaire concernant notre contrat [référence/service]. Nous avons bien noté la hausse proposée de [X] %.
>
> Avant d'accepter, nous souhaitons comprendre les facteurs qui justifient cet ajustement. L'IPC actuel est de [Y] %, et nous avons reçu des offres concurrentes en dessous de votre nouveau tarif pour des prestations équivalentes.
>
> Nous proposons les options suivantes :
>
> 1. Plafonner la hausse à [Z] %, en cohérence avec les indices de référence du marché.
> 2. Reporter l'application de 6 mois pour nous permettre de l'intégrer à notre prévision budgétaire.
> 3. Maintenir le tarif actuel en échange d'un engagement de [durée].
>
> Nous tenons à poursuivre notre collaboration. Pouvons-nous en discuter cette semaine ?
>
> Cordialement,
> [Votre Nom]

**Pourquoi cet e-mail fonctionne :** Il est factuel, propose des alternatives, et signale que vous avez fait vos recherches sans menacer la relation.

---

## L'essentiel

Les hausses de prix ne sont pas des décisions unilatérales. Ce sont des propositions. Et toute proposition se négocie.

Un fournisseur qui perd un client fidèle sur une hausse de 5 % fait une mauvaise affaire. Il le sait. Votre rôle est de lui rappeler, calmement et avec des données.

TermLift analyse votre devis fournisseur et identifie automatiquement les hausses, les écarts avec le marché, et les points de négociation. Collez votre devis et récupérez un e-mail de contestation prêt à envoyer.

**[Analysez votre devis](/try)**
`,
  },
  {
    slug: 'saas-renewal-checklist',
    title: 'Checklist de renouvellement SaaS : 10 points à vérifier avant de signer',
    description: 'Avant de renouveler votre contrat SaaS, passez en revue ces 10 points. Chaque point oublié est une économie manquée ou un risque accepté sans le savoir.',
    date: '2026-03-24',
    readTime: '5 min de lecture',
    category: 'SaaS',
    content: `
## 10 points. 15 minutes. Des milliers d'euros d'économies potentielles.

Le renouvellement SaaS est le moment où vous avez le plus de levier. Votre fournisseur veut votre signature. Vous avez le droit de poser des conditions. Voici les 10 points à vérifier systématiquement avant de signer.

---

## 1. Nombre de licences

Comparez le nombre de licences souscrites au nombre d'utilisateurs qui se connectent réellement. La plupart des entreprises paient 20 à 30 % de licences en trop. Sur un contrat à 50 licences à 80 par mois, 10 licences inutilisées représentent 9 600 par an de gaspillage. Demandez un réajustement au nombre d'utilisateurs actifs plus 10 % de marge.

**Ce qu'il faut demander :** « Pouvez-vous nous fournir les données d'utilisation des 6 derniers mois ? Nous souhaitons ajuster le nombre de licences au renouvellement. »

---

## 2. Préavis de renouvellement

Vérifiez le délai de notification pour refuser ou renégocier le renouvellement. Un préavis de 30 jours vous laisse très peu de temps pour évaluer les alternatives. Si vous manquez la fenêtre, vous êtes engagé automatiquement pour un cycle supplémentaire au tarif du fournisseur.

**Ce qu'il faut demander :** « Pouvons-nous allonger le délai de préavis de renouvellement à 60 jours minimum ? »

---

## 3. Clause d'augmentation

Vérifiez si le contrat autorise des hausses automatiques au renouvellement. Une clause de « jusqu'à 8 % par an » sur un contrat à 40 000 signifie un surcoût potentiel de 12 985 sur 3 ans par rapport à un tarif fixe. Si la clause existe, négociez un plafond à 3 % ou à l'IPC.

**Ce qu'il faut demander :** « La clause d'augmentation prévoit [X] %. Pouvons-nous la plafonner à 3 % ou à l'indice des prix, le plus bas des deux ? »

---

## 4. Durée d'engagement

Évaluez si un engagement annuel, pluriannuel ou mensuel correspond à vos besoins. Un engagement de 3 ans vous donne un levier sur le prix (les fournisseurs offrent 10 à 20 % de remise pour un engagement long), mais vous prive de flexibilité. Un engagement mensuel coûte plus cher mais vous permet de partir à tout moment.

**Ce qu'il faut demander :** « Quelle remise proposez-vous pour un engagement de 2 ans par rapport à un renouvellement annuel ? »

---

## 5. Conditions de paiement

Vérifiez si le paiement est annuel d'avance, trimestriel ou mensuel. Un paiement annuel d'avance de 48 000 immobilise votre trésorerie pendant 12 mois. Demandez un paiement trimestriel ou semestriel sans majoration. Si le fournisseur insiste sur le paiement annuel, négociez une remise de 3 à 5 % en contrepartie.

**Ce qu'il faut demander :** « Proposez-vous un échéancier trimestriel sans surcoût ? Si le paiement annuel est requis, y a-t-il une remise associée ? »

---

## 6. Fonctionnalités groupées

Identifiez les modules, options ou niveaux de service inclus dans votre forfait que vous n'utilisez pas. Les fournisseurs SaaS regroupent volontairement les fonctionnalités pour justifier un prix plus élevé. Un forfait « Entreprise » à 120 par utilisateur peut contenir des analyses avancées, un support premium et un accès API que votre équipe n'exploite pas. Le forfait « Professionnel » à 80 couvrirait vos besoins réels.

**Ce qu'il faut demander :** « Pouvons-nous passer au forfait [inférieur] ? Nous n'utilisons que [liste des fonctionnalités]. »

---

## 7. Données d'utilisation

Demandez au fournisseur un rapport d'utilisation détaillé. Ce rapport est votre meilleur outil de négociation. Il montre combien de licences sont actives, quelles fonctionnalités sont utilisées, et quel volume de stockage ou de transactions vous consommez réellement. Si les données montrent une sous-utilisation, vous avez un argument objectif pour réduire le périmètre.

**Ce qu'il faut demander :** « Pouvez-vous nous transmettre un rapport d'utilisation couvrant les 12 derniers mois, incluant les connexions actives, les fonctionnalités utilisées et le volume consommé ? »

---

## 8. Alternatives concurrentes

Avant de renouveler, obtenez 2 à 3 devis de solutions concurrentes. Vous n'avez pas besoin de changer de fournisseur. Le simple fait de disposer d'offres comparables renforce votre position de négociation. Un devis concurrent 15 % en dessous de votre tarif actuel est un argument que tout responsable de compte prendra au sérieux.

**Ce qu'il faut demander :** « Nous avons reçu des offres concurrentes en dessous de votre tarif pour des fonctionnalités équivalentes. Y a-t-il une marge de manœuvre sur le prix de renouvellement ? »

---

## 9. Date de fin de contrat

Identifiez la date exacte de fin de votre contrat actuel et programmez des rappels 90, 60 et 30 jours avant. La majorité des mauvaises affaires au renouvellement viennent d'un manque de préparation. Si vous commencez à négocier 10 jours avant l'échéance, le fournisseur sait que vous n'avez pas le temps de partir. Votre levier disparaît.

**Ce qu'il faut faire :** Programmez trois rappels dans votre agenda dès maintenant. 90 jours avant : lancez l'évaluation. 60 jours avant : envoyez vos demandes. 30 jours avant : finalisez l'accord.

---

## 10. Clause de sortie

Vérifiez les conditions de résiliation anticipée. Si le contrat ne prévoit aucune option de sortie pendant la période d'engagement, vous perdez tout levier une fois la signature apposée. Demandez une clause de résiliation pour convenance avec un préavis de 60 à 90 jours, ou une clause de sortie à mi-parcours moyennant une indemnité raisonnable.

**Ce qu'il faut demander :** « Pouvons-nous ajouter une clause de résiliation anticipée avec un préavis de 90 jours et un remboursement au prorata des mois restants ? »

---

## L'essentiel

Ces 10 points prennent 15 minutes à vérifier et peuvent vous faire économiser des milliers d'euros par renouvellement. Le meilleur moment pour négocier, c'est avant de signer. Après, il est trop tard.

TermLift automatise cette vérification. Collez votre devis de renouvellement SaaS et récupérez chaque signal d'alerte, chaque opportunité d'économie et un e-mail de négociation prêt à envoyer.

**[Analysez votre devis](/try)**
`,
  },
]
