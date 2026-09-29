import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.projects': 'Projets',
    'nav.experience': 'Parcours',
    'nav.blog': 'Carnet d’étude',
    'nav.skills': 'Intérêts',
    'nav.contact': 'Contact',
    'nav.sayHello': 'Say Hello',

    // Hero
    'hero.badge.role': 'Consultant confirmé chez Abylsen',
    'hero.badge.learning': 'En apprentissage Google Cloud & IA',
    'hero.title': 'Apprendre, expérimenter',
    'hero.title.italic': '& construire',
    'hero.desc': 'Développeur d’applications et consultant, j’accompagne des équipes techniques en mission (Thales, CMA-CGM, Petroineos, EDF) sur du développement fullstack et de la conception cloud, tout en continuant d’apprendre au quotidien de chaque problématique rencontrée.',
    'hero.cta': 'Découvrir mes projets',

    // Experience
    'exp.title': 'Mon parcours',
    'exp.intro': 'Mon parcours professionnel s’articule entre le conseil technique pour des grands comptes industriels via Abylsen et l’agilité de projets au sein de start-ups.\n\nJ’apprécie autant de me plonger dans la ré-écriture de requêtes de base de données complexes que de concevoir des interfaces soignées et adaptées aux opérations quotidiennes.',

    // Experience items: CMA CGM
    'exp.cma.role': 'Développeur Fullstack - Consultant',
    'exp.cma.period': '2025 - Présent',
    'exp.cma.desc.1': 'Amélioration de l’interface de suivi des conteneurs pour les équipes de gestion logistique.',
    'exp.cma.desc.2': 'Optimisation des temps de réponse des APIs de recherche et manipulation des flux de données.',
    'exp.cma.desc.3': 'Refonte ciblée d’écrans et composants clés vers des vues React & TypeScript stables (Docker, FastAPI).',

    // Experience items: Petroineos
    'exp.petro.role': 'Développeur Fullstack - Consultant',
    'exp.petro.period': '2025 - Présent',
    'exp.petro.desc.1': 'Conception de nouvelles interfaces et modernisation de l’outil de suivi des travaux de lignes de gaz.',
    'exp.petro.desc.2': 'Digitalisation des anciens fichiers Excel de suivi au sein d’une interface web unifiée (React, TypeScript, Node.js, PostgreSQL).',
    'exp.petro.desc.3': 'Optimisation des workflows métiers pour garantir un suivi qualitatif sur le terrain sans perte d’informations.',

    // Experience items: EDF
    'exp.edf.role': 'Développeur Python - Consultant',
    'exp.edf.period': '2025',
    'exp.edf.desc.1': 'Aide à la conception technique d’un logiciel d’analyse graphique retranscrivant les données captées sous forme de courbes interactives.',
    'exp.edf.desc.2': 'Développement de calculs à la volée et par placement de marqueurs sur les courbes, avec gestion des unités et multi-échelles (Python, PyGraph).',
    'exp.edf.desc.3': 'Optimisation du traitement des volumétries élevées de données énergétiques et affichage fluide en temps réel.',

    // Experience items: Unifox
    'exp.unifox.role': 'Développeur Fullstack / Backend',
    'exp.unifox.period': '2022 - 2023',
    'exp.unifox.desc.1': 'Mise en place de l’infrastructure de départ (Django, PostgreSQL) pour une plateforme d’investissement crypto assistée par IA.',
    'exp.unifox.desc.2': 'Développement from scratch du dashboard utilisateur dynamique et intégration aux APIs de flux de marché (Binance).',
    'exp.unifox.desc.3': 'Configuration des pipelines CI/CD d’intégration et déploiement continus avec 0 interruption de service.',

    // Experience items: Thales
    'exp.thales.role': 'Ingénieur Données / Développeur SQL',
    'exp.thales.period': '2020 - 2021',
    'exp.thales.desc.1': 'Tri et requêtage SQL de logs massifs pour analyser les dysfonctionnements du réseau de transports bordelais (TBM / Thales).',
    'exp.thales.desc.2': 'Détection anticipée des pannes matérielles et logicielles récurrentes afin de réduire les interventions curatives sur le terrain.',
    'exp.thales.desc.3': 'Optimisation de requêtes SQL volumineuses, procédures stockées, scripts Bash et création de tableaux de bord décisionnels.',

    // Projects Section
    'projects.badge': 'Projets & Réalisations',
    'projects.title': 'Quelques travaux de mission.',
    'projects.desc': 'Une sélection de sujets concrets sur lesquels je suis intervenu récemment, centrés sur le développement, la maintenance et l’automatisation.',
    'projects.stats': '5 Missions & Réalisations',
    'projects.clickMore': 'Cliquer pour voir le détail',
    'projects.modal.context': 'Contexte de la mission',
    'projects.modal.challenge': 'Problématique & Enjeux',
    'projects.modal.solution': 'Solution & Réalisations',
    'projects.modal.impact': 'Impact & Bénéfices',
    'projects.modal.tech': 'Stack technique',
    'projects.modal.close': 'Fermer',

    // Project: EDF
    'project.edf.title': 'Analyse de données captées',
    'project.edf.kpi': "Logiciel d'analyse graphique sous forme de courbes",
    'project.edf.desc': "Aide à la conception technique d’un outil permettant de retranscrire les données en courbes par type de données et d'y effectuer des calculs (graphiques interactifs).",
    'project.edf.context': 'Intervention en mission de conseil de développement pour la direction informatique d’EDF.',
    'project.edf.challenge': 'Nécessité de visualiser en temps réel des volumétries élevées de données de consommation et de production énergétique.',
    'project.edf.solution': "Conception de composants graphiques avec calculs à la volée ou déterminés par placement de marqueurs sur les courbes, gestion des différentes échelles d'unités.",
    'project.edf.impact': "Amélioration de l’affichage des données et traitement possibles directement dans l'application.",

    // Project: CMA-CGM
    'project.cma.title': 'Optimisation des routes maritimes',
    'project.cma.kpi': 'Outil de logistique',
    'project.cma.desc': 'Participation à l’amélioration de l’outil interne de suivi des conteneurs, axée sur la fluidité d’affichage et l’intégration de données.',
    'project.cma.context': 'Mission au sein des équipes logistiques et informatiques de CMA-CGM.',
    'project.cma.challenge': 'Suivi précis des conteneurs en transit mondial avec des temps d’attente réduits pour les contrôleurs logistiques lors des recherches multicritères.',
    'project.cma.solution': 'Refonte ciblée d’écrans de recherche vers React & TypeScript, conteneurisation Docker des modules et amélioration des passerelles API.',
    'project.cma.impact': 'Gain de temps significatif pour les gestionnaires lors du suivi des conteneurs prioritaires et stabilité accrue.',

    // Project: Petroineos
    'project.petro.title': "Suivi des travaux de lignes de gaz",
    'project.petro.kpi': 'Digitalisation des outils de suivi',
    'project.petro.desc': "Conception de nouvelles interfaces, modernisation de l'existant permettant aux équipes d'avoir un suivi qualitatif de leurs travaux.",
    'project.petro.context': 'Reprise et développement continu de la solution.',
    'project.petro.challenge': 'Rendre le workflow de suivi plus simple à suivre, à comprendre tout en proposant une amélioration des vues.',
    'project.petro.solution': "Refonte graphique et optimisation des différents workflow pour rendre l'application facilement utilisable sans pertes d'informations ou bousculer les habitudes.",
    'project.petro.impact': "Les équipes terrains peuvent se débarasser des anciens Excel de suivi, maintenant digitalisés dans l'interface. Plus de pertes d'informations et un meilleur suivi.",

    // Project: Unifox
    'project.uni.title': "Investissement crypto assisté par IA",
    'project.uni.kpi': 'Dévelopemment from scratch du dashboard utilisateur',
    'project.uni.desc': 'Mise en place de l’infrastructure de départ (Django, PostgreSQL), branchement à Binance et développement du dashboard utilisateur.',
    'project.uni.context': 'Développement fullstack au sein d’une startup fintech dynamique.',
    'project.uni.challenge': 'Construire un dashboard dynamique, réactif et brancher avec les différents algorithmes.',
    'project.uni.solution': 'Architecture de l’application sous Django & PostgreSQL, écriture des scripts de parsing et configuration des pipelines CI/CD de déploiement continu.',
    'project.uni.impact': "Mise en production rapide et automatisée des premiers algorithmes d’indicateurs avec 0 interruption de service. Choix multiples de types d'investissement.",

    // Project: Thales
    'project.thales.title': 'Analyse de pannes',
    'project.thales.kpi': 'Données de logistique',
    'project.thales.desc': 'Aide au tri et au requêtage SQL de logs massifs pour identifier de manière préventive les dysfonctionnements du réseau de transports bordelais.',
    'project.thales.context': 'Ingénierie de données pour le réseau de transport public TBM (Thales).',
    'project.thales.challenge': 'Extraire des tendances de pannes matérielles et logicielles au milieu de millions de logs quotidiens générés par les terminaux de contrôle.',
    'project.thales.solution': 'Optimisation des requêtes SQL et procédures stockées, scripts bash de tri des logs et création de tableaux de bord décisionnels Visual Code.',
    'project.thales.impact': 'Détection anticipée des pannes récurrentes, réduisant les interventions curatives sur le terrain.',

    // Article Page UI
    'article.back': 'Retour au carnet d’étude',
    'article.share': 'Partager l’article',
    'article.copyLink': 'Copier le lien',
    'article.copied': 'Lien copié dans le presse-papier !',
    'article.notFound': 'Article introuvable',
    'article.notFoundDesc': 'L’article que vous cherchez n’existe pas ou a été déplacé.',
    'article.readNext': 'Continuer la lecture',
    'article.author': 'Par Maxime Larrieu-Panini',
    'article.consultant': 'Consultant Développeur & Cloud',
    'article.frOnlyBanner': 'Cet article est actuellement rédigé en français.',
    'article.bilingualBadge': 'Disponible en FR & EN',
    'article.langFr': 'Français',
    'article.langEn': 'English',
    'article.saga.title': 'Thématique',
    'article.saga.partOf': 'Articles de cette thématique',
    'article.saga.current': 'Lecture en cours',
    'article.saga.part': 'Volet',
    'article.saga.seriesCount': 'articles dans cette thématique',
    'article.saga.next': 'Volet suivant',
    'article.saga.prev': 'Volet précédent',
    'article.saga.readSameFolder': 'Dans la même thématique',
    'article.saga.otherFolders': 'Autres thématiques & lectures récentes',

    // Lab / Blog
    'blog.badge': 'Carnet de veille TECHNIQUE',
    'blog.title': 'Mon carnet d’étude.',
    'blog.desc': 'Mes notes écrites régulièrement sur ce que j’apprends sur Kubernetes, les architectures cloud et l’IA utile.',
    'blog.filter.all': 'Tous les articles',
    'blog.filter.dossier': 'Thématique',
    'blog.folder.seriesBadge': 'Thématique',
    'blog.folder.part': 'Volet',
    'blog.folder.articles': 'articles',
    'blog.goal.heading': 'Objectif de lecture',
    'blog.goal.title': 'Cloud solutions architect',
    'blog.read': 'Lire l’article',
    'blog.published': 'Publié le',
    'blog.readtime': 'de lecture',
    'blog.viewAll': 'Voir tous les articles',
    'blog.showLess': 'Afficher les 3 derniers',

    // Blog 1: Cloud Architect
    'blog.1.title': 'Vers la certification Cloud Solutions Architect (GCP)',
    'blog.1.category': 'Architecture Cloud',
    'blog.1.readTime': '4 min',
    'blog.1.excerpt': 'Mes notes de révision quotidiennes basées sur les modules Google Skills Boost et la recherche de conceptions logiques et sécurisées.',
    'blog.1.content': `
      <h2>Pourquoi passer cette certification ?</h2>
      <p>L’exercice d'apprentissage lié aux modèles de conception Google Cloud m’aide beaucoup à concevoir des architectures plus rationnelles, abordables et sécurisées au quotidien pour mes missions.</p>
      
      <h3>Mes axes de révision actuels :</h3>
      <ul>
        <li>Bien comprendre le découpage des réseaux au sein de VPC isolés et sécurisés.</li>
        <li>Maîtriser le déploiement sur Cloud Run pour optimiser la charge et ne payer que la ressource utilisée.</li>
        <li>Gérer correctement le principe du moindre privilège via les rôles IAM de sécurité.</li>
      </ul>
      
      <p>C’est un apprentissage progressif que je documente ici humblement au fil de mes lectures.</p>
    `,

    // Blog 2: Vertex
    'blog.2.title': 'Premiers pas pratiques avec Vertex AI',
    'blog.2.category': 'Découvertes',
    'blog.2.readTime': '5 min',
    'blog.2.excerpt': 'Une exploration pas à pas des services d’IA générative de Google Cloud pour comprendre comment connecter un modèle générique à des documents métier.',
    'blog.2.content': `
      <h2>Démystifier l'intégration d'IA</h2>
      <p>Plutôt que de suivre les discours marketing, j'ai voulu tester d'intégrer concrètement un modèle généraliste à des documents de référence (méthode RAG) avec Vertex AI.</p>
      
      <h3>Ce que j'en retiens :</h3>
      <p>La mise en place technique est aujourd’hui grandement simplifiée par les plateformes cloud, mais le véritable enjeu réside dans la pertinence de la donnée fournie.</p>
      
      <p>C'est un exercice intéressant pour imaginer des automatisations d'analyse de rapports techniques longs ou de synthèses de documents utiles aux équipes métiers.</p>
    `,

    // Capabilities / Skills
    'skills.badge': "Domaines d'intérêt",
    'skills.title': "Ce que j'aime manipuler.",
    'skills.desc': "Passionné par le développement d'architectures fiables, j'ai une forte appétence pour l'automatisation et l'intégration pragmatique de l'IA dans les outils métier, en privilégiant toujours un code propre, lisible et maintenable.",
    'skills.tech': 'Mon environnement de travail',

    // Offerings
    'skills.offering.1.title': "Développement d'applications",
    'skills.offering.1.desc': "Conception d'analyses et de composants web de bout en bout, de l'interaction utilisateur jusqu'à la modélisation de la base de données.",
    'skills.offering.2.title': "Outils sur-mesure",
    'skills.offering.2.desc': "Écriture de scripts d'automatisation, de tableaux de bord internes ou de passerelles d'APIs pour simplifier des tâches répétitives.",
    'skills.offering.3.title': "IA & Systèmes Autonomes",
    'skills.offering.3.desc': "Déploiement de modèles locaux (Ollama, vLLM), pipelines RAG, architectures multi-agents et intégration d'APIs LLM modernes.",

    // Skill Groups
    'skills.group.frontend': 'Frontend',
    'skills.group.backend': 'Backend & Data',
    'skills.group.devops': 'Outils & DevOps',
    'skills.group.ai': 'IA & LLM',
    'skills.group.practices': 'Pratiques simples',

    'skill.ai.localmodels': 'Ollama & LLMs locaux',
    'skill.ai.multiagents': 'Systèmes Multi-Agents',
    'skill.ai.rag': 'RAG & Vector DBs',
    'skill.ai.apis': 'APIs LLM & Orchestration',
    'skill.practices.scrum': 'Méthodes Agiles',
    'skill.practices.test': 'Tests unitaires',

    // Contact
    'contact.title': 'Échangeons ensemble.',
    'contact.desc': 'Si vous avez un projet d’application web à concevoir, un besoin d’automatisation de flux, d’intégration d’IA ou simplement envie d’échanger sur des problématiques d’ingénierie et de cloud, n’hésitez pas.\n\nJe serai ravi de discuter de vos idées et de voir comment je peux vous aider simplement, sans fioritures.',
    'contact.geo': 'Aix-en-Provence, France (Remote)',
    'contact.socials': 'Réseaux sociaux',
    
    // Contact Form
    'contact.form.name': 'Nom & Prénom',
    'contact.form.email': 'Adresse e-mail',
    'contact.form.need': 'Type de besoin',
    'contact.form.desc': 'Description du besoin',
    'contact.form.submit': 'Envoyer le message',
    'contact.form.placeholder.name': 'ex. Jean Dupont',
    'contact.form.placeholder.email': 'ex. jean@societe.fr',
    'contact.form.placeholder.msg': 'Racontez-moi simplement votre projet ou posez votre question ici...',

    'contact.form.opt.app': 'Développement d’application web',
    'contact.form.opt.script': 'Automatisation de flux & Outils internes',
    'contact.form.opt.ai': 'Intégration IA & Systèmes intelligents',
    'contact.form.opt.consult': 'Conseil d’architecture & Cloud',
    'contact.form.opt.other': 'Autre sujet',

    // Footer
    'footer.copyright': '© {year} Maxime Larrieu-Panini. Construit avec simplicité.',
    'footer.built': 'Construit avec simplicité.',
    'footer.location': 'Aix-en-Provence, France',

    // AI Chat
    'chat.title': 'Maximus (Assistant IA)',
    'chat.status': 'Disponible',
    'chat.greetings': 'Bonjour ! Je suis l’assistant virtuel de Maxime. Comment puis-je vous aider au sujet de son parcours, ses projets ou ses lectures ?',
    'chat.thinking': 'Réflexion de Maximus...',
    'chat.loading': 'Réflexion de Maximus...',
    'chat.intro': 'Bonjour ! Je suis l’assistant virtuel de Maxime. Comment puis-je vous aider au sujet de son parcours, ses projets ou ses lectures ?',
    'chat.placeholder': 'Posez une question à l’IA...',
    'chat.prompt.projects': 'Quels sont tes projets ?',
    'chat.prompt.stack': 'Qu’aimes-tu comme technologies ?',
    'chat.prompt.availability': 'Quelles sont tes disponibilités ?',
    'chat.demomode': 'Bonjour ! Je suis l’assistant virtuel de Maxime. Je fonctionne actuellement en mode démo. Maxime adore travailler sur React, Node.js et Google Cloud. N’hésitez pas à jeter un œil à ses projets ou à le contacter directement via le formulaire !'
  },
  en: {
    // Navbar
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.blog': 'Study Journal',
    'nav.skills': 'Interests',
    'nav.contact': 'Contact',
    'nav.sayHello': 'Say Hello',

    // Hero
    'hero.badge.role': 'Confirmed Consultant at Abylsen',
    'hero.badge.learning': 'Learning Google Cloud & AI',
    'hero.title': 'Learn, experiment',
    'hero.title.italic': '& build',
    'hero.desc': 'Application developer and consultant, I support technical teams on site (Thales, CMA-CGM, Petroineos, EDF) for fullstack development and cloud design, while continuously learning from every daily challenge.',
    'hero.cta': 'Explore my projects',

    // Experience
    'exp.title': 'My Journey',
    'exp.intro': 'My professional path balances technical consulting for large industrial enterprises via Abylsen with the agility of startup projects.\n\nI enjoy diving into complex database query optimization as much as crafting simple, polished interface workflows, keeping daily operational needs at heart.',

    // Experience items: CMA CGM
    'exp.cma.role': 'Fullstack Developer - Consultant',
    'exp.cma.period': '2025 - Present',
    'exp.cma.desc.1': 'Enhancing the container tracking interface for logistics operations teams.',
    'exp.cma.desc.2': 'Optimizing search API response times and data streaming pipelines.',
    'exp.cma.desc.3': 'Refactoring key components into stable React & TypeScript views with Docker and FastAPI.',

    // Experience items: Petroineos
    'exp.petro.role': 'Fullstack Developer - Consultant',
    'exp.petro.period': '2025 - Present',
    'exp.petro.desc.1': 'Designing new interfaces and modernizing the gas pipeline works tracking application.',
    'exp.petro.desc.2': 'Digitizing legacy spreadsheet tracking into a unified web application (React, TypeScript, Node.js, PostgreSQL).',
    'exp.petro.desc.3': 'Optimizing operational workflows to ensure reliable field monitoring without data loss.',

    // Experience items: EDF
    'exp.edf.role': 'Python Developer - Consultant',
    'exp.edf.period': '2025',
    'exp.edf.desc.1': 'Technical design of a visual charting tool plotting sensor data into interactive curves.',
    'exp.edf.desc.2': 'Developing on-the-fly and marker-based curve calculation features with multi-scale unit handling (Python, PyGraph).',
    'exp.edf.desc.3': 'Optimizing real-time rendering and processing for high-volume energy production and consumption data.',

    // Experience items: Unifox
    'exp.unifox.role': 'Fullstack / Backend Developer',
    'exp.unifox.period': '2022 - 2023',
    'exp.unifox.desc.1': 'Setting up initial backend infrastructure (Django, PostgreSQL) for an AI-assisted crypto investment platform.',
    'exp.unifox.desc.2': 'Building the responsive user dashboard from scratch and connecting financial market data feeds (Binance).',
    'exp.unifox.desc.3': 'Configuring CI/CD pipelines for continuous deployment with zero downtime and automated releases.',

    // Experience items: Thales
    'exp.thales.role': 'Data Engineer / SQL Developer',
    'exp.thales.period': '2020 - 2021',
    'exp.thales.desc.1': 'Sorting and querying large volumes of transit logs to analyze Bordeaux transit network faults (TBM / Thales).',
    'exp.thales.desc.2': 'Early detection of recurring hardware and software issues to minimize corrective field interventions.',
    'exp.thales.desc.3': 'Optimizing heavy SQL queries and stored procedures, Bash log parsing scripts, and decision dashboard setup.',

    // Projects Section
    'projects.badge': 'Projects & Work',
    'projects.title': 'Selected client work.',
    'projects.desc': 'An honest selection of real-world assignments I joined recently, centering on lightweight design, backend stability, and scripts tuning.',
    'projects.stats': '5 Key Missions & Projects',
    'projects.clickMore': 'Click to view details',
    'projects.modal.context': 'Project Context',
    'projects.modal.challenge': 'Challenge & Objectives',
    'projects.modal.solution': 'Solution & Key Work',
    'projects.modal.impact': 'Impact & Results',
    'projects.modal.tech': 'Tech Stack',
    'projects.modal.close': 'Close',

    // Project: EDF
    'project.edf.title': 'Sensor data analysis',
    'project.edf.kpi': 'Chart-based visual analytics software',
    'project.edf.desc': 'Assisted in the technical design of an interactive charting tool to plot metrics by data type and run calculations on the fly.',
    'project.edf.context': 'Software development consulting assignment for the EDF IT department.',
    'project.edf.challenge': 'Visualizing large volumes of real-time energy production and consumption data.',
    'project.edf.solution': 'Engineered chart components with real-time and marker-based calculations, along with multi-unit scale support.',
    'project.edf.impact': 'Improved data visualization and direct in-app data processing.',

    // Project: CMA-CGM
    'project.cma.title': 'Maritime cargo tracker',
    'project.cma.kpi': 'Logistics tool',
    'project.cma.desc': 'Optimizing and updating global container workflows, reducing loading lags, and integrating API pipelines.',
    'project.cma.context': 'Consulting assignment supporting CMA-CGM logistics software development.',
    'project.cma.challenge': 'Accurate global tracking of containers in transit with minimal latency during complex search filter queries.',
    'project.cma.solution': 'Refactored search views using React & TypeScript, containerized modules with Docker, and enhanced API gateways.',
    'project.cma.impact': 'Saved significant time for logistics officers tracking priority containers, with increased system stability.',

    // Project: Unifox
    'project.uni.title': 'AI-driven crypto investing',
    'project.uni.kpi': 'Built user dashboard from scratch',
    'project.uni.desc': 'Set up initial infrastructure (Django, PostgreSQL), connected Binance API, and built the user dashboard.',
    'project.uni.context': 'Full-stack development in a fast-paced fintech startup.',
    'project.uni.challenge': 'Build a dynamic, responsive dashboard and integrate it with proprietary trading algorithms.',
    'project.uni.solution': 'Architected the application with Django & PostgreSQL, wrote parsing scripts, and set up CI/CD pipelines for continuous deployment.',
    'project.uni.impact': 'Fast, automated release of the first indicator algorithms with zero downtime. Multiple investment options enabled.',

    // Project: Petroineos
    'project.petro.title': "Gas pipeline works tracking",
    'project.petro.kpi': 'Digitization of tracking tools',
    'project.petro.desc': "Designing new interfaces and modernizing the existing system to enable teams to track their work with high accuracy.",
    'project.petro.context': 'Takeover and continuous development of the solution.',
    'project.petro.challenge': 'Making the tracking workflow easier to follow and understand, while enhancing the views.',
    'project.petro.solution': 'UI redesign and workflow optimization to make the application intuitive without losing information or disrupting user habits.',
    'project.petro.impact': 'Field teams can phase out legacy tracking spreadsheets, now digitized into the platform. No more data loss and improved tracking efficiency.',

    // Project: Thales
    'project.thales.title': 'Preventive fault diagnostic',
    'project.thales.kpi': 'Operational logs analysis',
    'project.thales.desc': 'Sorting and optimization of complex relational database querying sequences to assist transit terminal maintenance.',
    'project.thales.context': 'Data engineering assignment for the TBM public transit network (Thales).',
    'project.thales.challenge': 'Extracting hardware failure trends from millions of daily ticketing machine logs.',
    'project.thales.solution': 'Optimized SQL procedures, wrote predictive Python analysis scripts, and created decision dashboards on Metabase.',
    'project.thales.impact': 'Early detection of recurring hardware faults, reducing field maintenance interventions.',

    // Article Page UI
    'article.back': 'Back to study journal',
    'article.share': 'Share article',
    'article.copyLink': 'Copy direct link',
    'article.copied': 'Link copied to clipboard!',
    'article.notFound': 'Article not found',
    'article.notFoundDesc': 'The article you are looking for does not exist or was moved.',
    'article.readNext': 'Keep reading',
    'article.author': 'By Maxime Larrieu-Panini',
    'article.consultant': 'Developer & Cloud Consultant',
    'article.frOnlyBanner': 'This article is currently only available in French.',
    'article.bilingualBadge': 'Available in FR & EN',
    'article.langFr': 'Français',
    'article.langEn': 'English',
    'article.saga.title': 'Theme',
    'article.saga.partOf': 'Articles in this theme',
    'article.saga.current': 'Currently reading',
    'article.saga.part': 'Part',
    'article.saga.seriesCount': 'articles in this theme',
    'article.saga.next': 'Next part',
    'article.saga.prev': 'Previous part',
    'article.saga.readSameFolder': 'In the same theme',
    'article.saga.otherFolders': 'Other themes & recent reads',

    // Lab / Blog
    'blog.badge': 'TECHNICAL JOURNAL',
    'blog.title': 'My study notes.',
    'blog.desc': 'Short records on what I study regarding Cloud infrastructure, database architectures, and practical API adapters.',
    'blog.filter.all': 'All articles',
    'blog.filter.dossier': 'Theme',
    'blog.folder.seriesBadge': 'Thematic',
    'blog.folder.part': 'Part',
    'blog.folder.articles': 'articles',
    'blog.goal.heading': 'Target Reading',
    'blog.goal.title': 'Cloud solutions architect',
    'blog.read': 'Read article',
    'blog.published': 'Published on',
    'blog.readtime': 'read',
    'blog.viewAll': 'View all articles',
    'blog.showLess': 'Show 3 latest',

    // Blog 1: Cloud Architect
    'blog.1.title': 'Steps to the Google Cloud Solutions Architect exam',
    'blog.1.category': 'Cloud Architecture',
    'blog.1.readTime': '4 min',
    'blog.1.excerpt': 'My daily study log on Google Cloud architecture guidelines and building clear, logical solutions securely.',
    'blog.1.content': `
      <h2>Why this certification?</h2>
      <p>Digging into Google Cloud standard models helps me design reliable, cost-effective, and highly secure cloud instances for my clients everyday.</p>
      
      <h3>Current study focuses:</h3>
      <ul>
        <li>Configuring well-segmented VPC structures for proper network isolation.</li>
        <li>Leveraging serverless Cloud Run pipelines to scale resources accurately and minimize running bills.</li>
        <li>Correctly implementing minimal privilege principles using deep Cloud IAM configurations.</li>
      </ul>
      
      <p>I constantly record my study thoughts inside this humble notebook along my certification path.</p>
    `,

    // Blog 2: Vertex
    'blog.2.title': 'First experiments with Vertex AI tools',
    'blog.2.category': 'Discoveries',
    'blog.2.readTime': '5 min',
    'blog.2.excerpt': 'Testing practical applications of Vertex AI models to see how to align generic tools with structured commercial documents.',
    'blog.2.content': `
      <h2>Demystifying AI implementation steps</h2>
      <p>Bypassing the corporate marketing, I wanted to build and test actual data-grounding mechanisms (RAG logic) using Vertex AI API options.</p>
      
      <h3>My raw takeaways:</h3>
      <p>Connecting third-party interfaces is made incredibly simple by cloud frameworks, but the true value lies purely in the reliability and layout of original source material.</p>
      
      <p>It remains a highly interesting test bed for summarizing technical documents or speeding up manual logistics logs search.</p>
    `,

    // Capabilities / Skills
    'skills.badge': 'Areas of Interest',
    'skills.title': 'What I like building with.',
    'skills.desc': 'Driven by building reliable architectures, I have a strong appetite for workflow automation and pragmatic AI integration, always prioritizing clean, readable, and maintainable code.',
    'skills.tech': 'My preferred tool suite',

    // Offerings
    'skills.offering.1.title': 'Web application development',
    'skills.offering.1.desc': 'End-to-end frontend interfaces and lightweight backend services, linking user actions smoothly to database tables.',
    'skills.offering.2.title': 'Custom scripts & automation',
    'skills.offering.2.desc': 'Setting up simple background tasks, admin dashboard widgets, or webhook APIs to skip redundant work.',
    'skills.offering.3.title': 'AI & Autonomous Systems',
    'skills.offering.3.desc': 'Deploying local open-source models (Ollama, vLLM), designing RAG workflows, and orchestrating autonomous agent architectures.',

    // Skill Groups
    'skills.group.frontend': 'Frontend',
    'skills.group.backend': 'Backend & Data',
    'skills.group.devops': 'Tools & DevOps',
    'skills.group.ai': 'AI & LLMs',
    'skills.group.practices': 'Daily practices',

    'skill.ai.localmodels': 'Ollama & Local LLMs',
    'skill.ai.multiagents': 'Multi-Agent Systems',
    'skill.ai.rag': 'RAG & Vector DBs',
    'skill.ai.apis': 'LLM APIs & Orchestration',
    'skill.practices.scrum': 'Agile practices',
    'skill.practices.test': 'Unit tests',

    // Contact
    'contact.title': 'Let’s chat.',
    'contact.desc': 'Whether you have a web application project, workflow automation needs, AI integration ideas, or simply want to discuss software engineering and cloud patterns, feel free to get in touch.\n\nI’d be happy to talk about your ideas and see how I can help in a direct, practical manner without any fluff.',
    'contact.geo': 'Aix-en-Provence, France (Remote)',
    'contact.socials': 'Find me here',
    
    // Contact Form
    'contact.form.name': 'Your name',
    'contact.form.email': 'Email address',
    'contact.form.need': 'Project focus',
    'contact.form.desc': 'What are your goals?',
    'contact.form.submit': 'Send message',
    'contact.form.placeholder.name': 'e.g. John Doe',
    'contact.form.placeholder.email': 'e.g. john@company.com',
    'contact.form.placeholder.msg': 'Share a few words about your project or ask any questions...',

    'contact.form.opt.app': 'Web application project',
    'contact.form.opt.script': 'Workflow automation & internal tools',
    'contact.form.opt.ai': 'AI integration & smart systems',
    'contact.form.opt.consult': 'Architecture & Cloud consulting',
    'contact.form.opt.other': 'Other topics',

    // Footer
    'footer.copyright': '© {year} Maxime Larrieu-Panini. Crafted keep it simple.',
    'footer.built': 'Built with simplicity.',
    'footer.location': 'Aix-en-Provence, France',

    // AI Chat
    'chat.title': 'Maximus (AI Assistant)',
    'chat.status': 'Active online',
    'chat.greetings': 'Hi! I’m Maxime’s AI counterpart. How can I help you know more about his projects, study journal, or background?',
    'chat.thinking': 'Maximus is drafting...',
    'chat.loading': 'Maximus is drafting...',
    'chat.intro': 'Hi! I’m Maxime’s AI counterpart. How can I help you know more about his projects, study journal, or background?',
    'chat.placeholder': 'Ask a question...',
    'chat.prompt.projects': 'What are your projects?',
    'chat.prompt.stack': 'What is your stack?',
    'chat.prompt.availability': 'What is your availability?',
    'chat.demomode': 'Hello! I am Maxime’s virtual assistant. I am currently running in demo mode. Maxime loves writing clean scripts, frontend views, and Google Cloud setups. Feel free to browse his projects or write him an email!'
  }
};

function detectInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    if (pathname.startsWith('/en/') || pathname === '/en' || hash.startsWith('#/en/') || hash === '#/en') {
      return 'en';
    }
    const stored = localStorage.getItem('max_portfolio_lang');
    if (stored === 'en' || stored === 'fr') {
      return stored as Language;
    }
    const userLang = navigator.language || '';
    if (userLang.toLowerCase().startsWith('en')) {
      return 'en';
    }
  }
  return 'fr';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const syncFromUrl = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname.startsWith('/en/') || pathname === '/en' || hash.startsWith('#/en/') || hash === '#/en') {
        setLanguageState('en');
        document.documentElement.lang = 'en';
      } else if (
        pathname.startsWith('/blog/') || pathname.startsWith('/article/') || pathname.startsWith('/posts/') ||
        hash.startsWith('#/blog/') || hash.startsWith('#/article/') || hash.startsWith('#/posts/')
      ) {
        setLanguageState('fr');
        document.documentElement.lang = 'fr';
      }
    };

    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('max_portfolio_lang', lang);
    document.documentElement.lang = lang;

    // Harmonize current URL when on an article
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isEnArticle = pathname.startsWith('/en/blog/') || pathname.startsWith('/en/article/') || pathname.startsWith('/en/posts/');
      const isFrArticle = pathname.startsWith('/blog/') || pathname.startsWith('/article/') || pathname.startsWith('/posts/');

      if (lang === 'en' && isFrArticle) {
        let newPath = pathname;
        if (pathname.startsWith('/blog/')) newPath = pathname.replace('/blog/', '/en/blog/');
        else if (pathname.startsWith('/article/')) newPath = pathname.replace('/article/', '/en/article/');
        else if (pathname.startsWith('/posts/')) newPath = pathname.replace('/posts/', '/en/posts/');
        window.history.pushState(null, '', newPath);
        window.dispatchEvent(new Event('popstate'));
      } else if (lang === 'fr' && isEnArticle) {
        const newPath = pathname.replace('/en/', '/');
        window.history.pushState(null, '', newPath);
        window.dispatchEvent(new Event('popstate'));
      }
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['fr'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
