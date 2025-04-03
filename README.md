# NeuroByte Fast Food

NeuroByte Fast Food est une chaîne de restaurants cybernétique futuriste qui propose des produits de fast-food avec livraison automatisée supportée par une IA quantique nouvelle génération.

## Installation & Scripts

- `deno install`: Installation des dépendances
- `deno run src/main.ts`: Lancement du programme de production
- `deno run test` : Lancement des tests unitaires
- `deno run test:watch` : Lancement des tests unitaires avec rechargement automatique à chaque changement de fichier

## Consignes

### Récits Utilisateurs (User stories)

Ecrivez les récits utilisateurs de l'application, avec les régles d'acceptation associées.

### Patrons de conception (design patterns)

Dans les fichiers suivants :

- `src\domain\order.ts`
- `src\services\orderTotal.service.ts`

Il est possible d'utiliser 3 (voir 4) design patterns pour améliorer le code et le rendre plus flexible à des modifications futures.

Implémentez ces design patterns.

_Indice : Il y a 1 design pattern structurel, 2 comportementaux. Pour le 4ème [optionnel] ça serait un design pattern de création à associer à un autre design pattern._

_Vérifiez que votre code fonctionne toujours à l'aide des tests unitaires qui ont été défini._

### Architecture logiciel

Le fast food souhaite faire évoluer les fonctionnalités de son application en cours de conception de la façon suivante :

**La direction doit pouvoir** :

- Avoir accès à des statistiques et rapports pour suivre leur activité et optimiser leurs ventes

**Les différents moyens de livraison automatisés (drone, hoverbike, supeerc0nduct0r) doivent pouvoir** :

- Être réquisitionné de l'entrepôt le plus proche dès que disponible pour récupérer un lot de commandes (il y a donc une gestion du stockage des moyens de transports dans les entrepôts)
- Confirmer la prise en charge d'un lot de commandes
- Confirmer la livraison d'une commande

**Les clients doivent pouvoir** :

- Depuis une application mobile ou une borne de commande physique :
  - Recevoir des alertes en temps réel de l'état de leur commande
  - Parcourir les produits à commander pour composer une commande
  - Pouvoir effectuer le paiement de la commande

**Les cuisiniers des Fast Foods doivent pouvoir** :

- Avoir un suivi des commandes à préparer
- Confirmer qu'une commande est en cours de préparation
- Confirmer qu'une commande est prête

**Attentes de l'entreprise** :

L'entreprise souhaite une architecture évolutive et flexible qui doit permettre de gérer un nombre croissant d'utilisateur rapidement car ils souhaitent se déployer à grande échelle à l'international.

Faites une proposition d'architecture avec un schéma d'architecture d'application.
Indiquez quel type d'architecture vous souhaitez utiliser et justifiez votre choix.

[Guide diagramme d'architecture d'application](https://www.edrawsoft.com/fr/article/application-architecture-diagram.html)

## Barême de Notation

- Récits Utilisateurs (User stories) : 4 points
- Patrons de conception (design patterns) : 8 points
- Architecture logicielle : 8 points

Un malus peut être appliqué si vos propositions ne sont pas originales et ressemblent à d'autres travaux.

Bon courage !
