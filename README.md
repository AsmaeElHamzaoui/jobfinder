# Jobfinder

### Description du projet
Jobfinder JobFinder est une application de recherche d'emplois qui permet aux chercheurs d'emploi de consulter des offres d'emploi provenant de plusieurs sources internationales via une ou plusieurs APIs publiques.

### Fonctionnalités principales

1. Inscription et Connexion

 - Les chercheurs d’emploi peuvent créer un compte en renseignant les informations suivantes :
Nom
Prénom
Email
Mot de passe
 - Chaque utilisateur peut :
Modifier ses informations personnelles (nom, prénom, email, mot de passe)
Supprimer son compte si nécessaire

 2. Recherche d'Emplois 
  
  Le chercheur d'emploi (même s'il n'est pas authentifié) peut effectuer une recherche d'offres d'emploi avec les critères suivants :

Filtres de recherche obligatoires :
Mots clés (titre du poste) : champ texte (input) dans une barre de recherche
Localisation (ville, pays, région) : liste déroulante (select) ou champ texte (input) pour saisir la localisation souhaitée

3. Gestion des Favoris

 - Ajouter une offre à ses favoris depuis la liste des offres via le bouton "favoris" (visible uniquement pour les utilisateurs authentifiés)
 - Consulter ses offres favorites dans une page dédiée.
 - Supprimer une offre de ses favoris.


4. Suivi des Candidatures

 - Ajouter une offre au suivi des candidatures à partir de la liste des offres via le bouton "Suivre cette candidature" (visible uniquement pour les utilisateurs authentifiés)
 - Consulter la liste de toutes les candidatures suivies.
 - Ajouter des notes personnelles pour chaque candidature (optionnel).
 - Supprimer une candidature de sa liste de suivi.


### Technologies utilisées

- Angular version 17 ou plus (module ou standalone au choix)
-  Gestion d'état NgRx : pour gérer au minimum la partie favoris
-  RxJS/Observables
- Injection de dépendance
- Formulaire via Reactive Forms ou Template Driven Forms
- Bootstrap 
- Guards, resolvers
- Databinding
- Service, Pipes, Parent/Child components, Routing
 

### Installation et Configuration

Étape 1 : Cloner le repository

```
   git clone https://github.com/AsmaeElHamzaoui/jobfinder
   cd jobfinder
```

Étape 2 : runer l'aaplication
```
   npm install
   npm start
```
