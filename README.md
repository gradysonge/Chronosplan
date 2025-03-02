
# Gestion des Emplois du Temps lacité-ChronosPlan

Application web de gestion des emplois du temps pour les établissements d'enseignement, développée avec React et Tailwind CSS.

## 🚀 Fonctionnalités

- **Gestion des Créneaux Horaires**
  - Attribution des cours par professeur
  - Gestion des conflits d'horaires
  - Support des cours en ligne et en présentiel
  - Créneaux flexibles de 1 à 3 heures

- **Vue Calendrier Interactive**
  - Affichage hebdomadaire (Lundi à Vendredi)
  - Plages horaires de 8h à 22h
  - Visualisation par étape
  - Aperçu en temps réel lors de la sélection

- **Statistiques des Professeurs**
  - Suivi des heures par professeur
  - Répartition présentiel/en ligne
  - Export des emplois du temps individuels (Excel)
  - Statistiques globales

## 🛠️ Technologies Utilisées

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React (icônes)
- XLSX (export Excel)

## 📦 Installation

1. Clonez le dépôt :
```bash
git clone [url-du-repo]
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

## 🎯 Guide d'Utilisation

### Attribution d'un Créneau

1. Sélectionnez une étape dans le sélecteur d'étapes
2. Remplissez tous les champs requis :
   - Code Professeur
   - Code Cours
   - Mode d'enseignement
   - Étape
   - Durée (Token shift)
3. Cliquez sur un créneau disponible dans le calendrier

### Règles de Gestion

- Maximum 2 cours simultanés par créneau
- Pas de chevauchement pour un même cours/mode d'enseignement
- Durée maximale jusqu'à 22h
- Suppression possible des créneaux attribués

### Export des Emplois du Temps

1. Accédez aux statistiques des professeurs
2. Cliquez sur l'icône d'export pour le professeur souhaité
3. Le fichier Excel généré contient :
   - Récapitulatif des heures
   - Détail par étape
   - Planning hebdomadaire

## 🎨 Personnalisation

Les couleurs des créneaux sont attribuées automatiquement par professeur :
- P1 : Bleu
- P2 : Vert
- P3 : Violet
- etc.

## 🤝 Contribution

A definir

## 📄 Licence

A definir
=======
# Projet Chronos Plan

