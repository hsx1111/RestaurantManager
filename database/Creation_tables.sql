DROP DATABASE IF EXISTS Restaurant_manager;
CREATE DATABASE Restaurant_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Restaurant_manager;

CREATE TABLE utilisateur (
    IdUtilisateur INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL,
    Prenom VARCHAR(100) NOT NULL,
    Code VARCHAR(255) NOT NULL,
    Role ENUM('Serveur', 'Gestionnaire', 'Cuisine') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE client (
    IdClient INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL,
    Prenom VARCHAR(100) NOT NULL,
    Telephone VARCHAR(20) NULL,
    Email VARCHAR(150) NULL,
    DateInscription DATETIME NOT NULL,
    CONSTRAINT uq_client_email UNIQUE (Email)
) ENGINE=InnoDB;

CREATE TABLE categorie (
    IdCategorie INT AUTO_INCREMENT PRIMARY KEY,
    NomCategorie VARCHAR(100) NOT NULL,
    CONSTRAINT uq_categorie_nom UNIQUE (NomCategorie)
) ENGINE=InnoDB;

CREATE TABLE plat (
    IdPlat INT AUTO_INCREMENT PRIMARY KEY,
    NomPlat VARCHAR(150) NOT NULL,
    Description VARCHAR(500) NULL,
    Prix DECIMAL(8, 2) NOT NULL,
    IdCategorie INT NOT NULL,
    CONSTRAINT chk_plat_prix CHECK (Prix >= 0),
    CONSTRAINT fk_plat_categorie FOREIGN KEY (IdCategorie) REFERENCES categorie (IdCategorie)
) ENGINE=InnoDB;

CREATE TABLE restaurant_table (
    IdTable INT AUTO_INCREMENT PRIMARY KEY,
    NombrePlace INT NOT NULL,
    EstLibre BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_table_places CHECK (NombrePlace > 0)
) ENGINE=InnoDB;

CREATE TABLE commande (
    IdCommande INT AUTO_INCREMENT PRIMARY KEY,
    IdUtilisateur INT NOT NULL,
    IdClient INT NULL,
    IdTable INT NOT NULL,
    Statut ENUM('EnCours', 'Servie', 'Facturee', 'Annulee') NOT NULL DEFAULT 'EnCours',
    TypeService ENUM('Salle', 'AEmporter', 'Livraison') NOT NULL,
    DateCommande DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Notes VARCHAR(500) NULL,
    CONSTRAINT fk_commande_utilisateur FOREIGN KEY (IdUtilisateur) REFERENCES utilisateur (IdUtilisateur),
    CONSTRAINT fk_commande_client FOREIGN KEY (IdClient) REFERENCES client (IdClient),
    CONSTRAINT fk_commande_table FOREIGN KEY (IdTable) REFERENCES restaurant_table (IdTable)
) ENGINE=InnoDB;

CREATE TABLE detailcommande (
    IdDetailCommande INT AUTO_INCREMENT PRIMARY KEY,
    IdCommande INT NOT NULL,
    IdPlat INT NOT NULL,
    Quantite INT NOT NULL,
    PrixUnitaire DECIMAL(8, 2) NOT NULL,
    Prepare BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_detail_quantite CHECK (Quantite > 0),
    CONSTRAINT chk_detail_prix CHECK (PrixUnitaire >= 0),
    CONSTRAINT uq_detail_commande_plat UNIQUE (IdCommande, IdPlat),
    CONSTRAINT fk_detail_commande FOREIGN KEY (IdCommande) REFERENCES commande (IdCommande) ON DELETE CASCADE,
    CONSTRAINT fk_detail_plat FOREIGN KEY (IdPlat) REFERENCES plat (IdPlat)
) ENGINE=InnoDB;

CREATE TABLE reservation (
    IdReservation INT AUTO_INCREMENT PRIMARY KEY,
    IdTable INT NOT NULL,
    IdClient INT NOT NULL,
    NombrePersonne INT NOT NULL,
    DateHeureDebut DATETIME NOT NULL,
    DateHeureFin DATETIME NOT NULL,
    Statut ENUM('EnAttente', 'Confirmee', 'Honoree', 'Annulee') NOT NULL DEFAULT 'EnAttente',
    Notes VARCHAR(500) NULL,
    CONSTRAINT chk_reservation_personnes CHECK (NombrePersonne > 0),
    CONSTRAINT chk_reservation_periode CHECK (DateHeureFin > DateHeureDebut),
    CONSTRAINT fk_reservation_table FOREIGN KEY (IdTable) REFERENCES restaurant_table (IdTable),
    CONSTRAINT fk_reservation_client FOREIGN KEY (IdClient) REFERENCES client (IdClient)
) ENGINE=InnoDB;

CREATE TABLE facture (
    IdFacture INT AUTO_INCREMENT PRIMARY KEY,
    IdCommande INT NOT NULL,
    MontantTotal DECIMAL(10, 2) NOT NULL,
    ModePaiement ENUM('Especes', 'Carte', 'Cheque', 'Virement') NOT NULL,
    DateFacture DATETIME NOT NULL,
    CONSTRAINT chk_facture_montant CHECK (MontantTotal >= 0),
    CONSTRAINT uq_facture_commande UNIQUE (IdCommande),
    CONSTRAINT fk_facture_commande FOREIGN KEY (IdCommande) REFERENCES commande (IdCommande)
) ENGINE=InnoDB;

-- Empêche deux réservations actives qui se chevauchent sur la même table.
-- Une réservation est active tant qu'elle est en attente ou confirmée.
DELIMITER $$

CREATE TRIGGER check_reservation_overlap_insert
BEFORE INSERT ON reservation
FOR EACH ROW
BEGIN
    IF NEW.Statut IN ('EnAttente', 'Confirmee') THEN
        IF EXISTS (
            SELECT 1
            FROM reservation r
            WHERE r.IdTable = NEW.IdTable
              AND r.Statut IN ('EnAttente', 'Confirmee')
              AND NEW.DateHeureDebut < r.DateHeureFin
              AND NEW.DateHeureFin > r.DateHeureDebut
        ) THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Chevauchement de réservation : la table est déjà réservée sur ce créneau.';
        END IF;
    END IF;
END$$

CREATE TRIGGER check_reservation_overlap_update
BEFORE UPDATE ON reservation
FOR EACH ROW
BEGIN
    IF NEW.Statut IN ('EnAttente', 'Confirmee') THEN
        IF EXISTS (
            SELECT 1
            FROM reservation r
            WHERE r.IdTable = NEW.IdTable
              AND r.IdReservation <> NEW.IdReservation
              AND r.Statut IN ('EnAttente', 'Confirmee')
              AND NEW.DateHeureDebut < r.DateHeureFin
              AND NEW.DateHeureFin > r.DateHeureDebut
        ) THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Chevauchement de réservation : la table est déjà réservée sur ce créneau.';
        END IF;
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- Utilisateur MySQL dédié à l'application
-- Droits limités aux opérations CRUD sur Restaurant_manager
-- ============================================================
-- DROP avant CREATE : rend le script pleinement rejouable et garantit
-- que le mot de passe est toujours réinitialisé à la valeur attendue.
DROP USER IF EXISTS 'restaurant_app'@'localhost';
CREATE USER 'restaurant_app'@'localhost' IDENTIFIED BY 'RestoApp2026!';
GRANT SELECT, INSERT, UPDATE, DELETE ON Restaurant_manager.* TO 'restaurant_app'@'localhost';
FLUSH PRIVILEGES;