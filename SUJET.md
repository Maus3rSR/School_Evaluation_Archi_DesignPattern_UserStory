Contexte du système : Un restaurant futuriste cyberpunk propose plusieurs canaux de commande (sur place, à emporter, livraison) avec différents modes de livraison (vélo, voiture, drone) et différents états de commande.

Patrons de conception applicables :

Patron Fabrique (Factory)

Création des différents types de commandes (sur place, à emporter, livraison)
Création dynamique des objets de commande selon le canal

Patron Stratégie (Strategy)

Différentes stratégies de tarification selon le canal de commande
Stratégies de calcul des frais de livraison
Stratégies de remise/promotion

Patron État (State)

Gestion des états d'une commande :

En préparation
Prête
En cours de livraison
Livrée
Annulée

Transitions entre ces états avec des règles spécifiques

Patron Adaptateur (Adapter)
Intégration de systèmes externes :

API de paiement
Services de géolocalisation pour livraison
Systèmes de gestion de stock
Différents systèmes de notification client
