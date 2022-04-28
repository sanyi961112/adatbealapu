CREATE TABLE USRS (
   username VARCHAR2(64) NOT NULL,
   password VARCHAR2(64) NOT NULL,
   full_name VARCHAR2(64) NOT NULL,
   email VARCHAR2(64) NOT NULL,
   location VARCHAR2(64),
   PRIMARY KEY (username)
);
 
CREATE TABLE PHOTO (
   id_photo VARCHAR2(30) NOT NULL,
   title VARCHAR2(64) NOT NULL,
   description VARCHAR2(64) NOT NULL,
   uploadDate DATE NOT NULL,
   owner VARCHAR2(64) NOT NULL,
   image CLOB NOT NULL,
   currentRating NUMBER(4,5) NOT NULL,
   categories VARCHAR2(60) NOT NULL,
   location VARCHAR2(60) NOT NULL,
   PRIMARY KEY(id_photo),
   FOREIGN KEY (owner) REFERENCES USRS(username)
);

CREATE TABLE ALBUM (
   id_album VARCHAR2(30) NOT NULL,
   title VARCHAR2(60) NOT NULL,
   description VARCHAR2(64) NOT NULL,
   createDate VARCHAR2(30) NOT NULL,
   owner VARCHAR2(64) NOT NULL,
   CONSTRAINT fk_owner
    PRIMARY KEY(id_album),
    FOREIGN KEY (owner) REFERENCES USRS(username)
);

CREATE TABLE CATEGORIES (
   category_name VARCHAR2(64) NOT NULL
);

CREATE TABLE CITIES (
   id_city VARCHAR2(30) NOT NULL,
   name VARCHAR2(128) NOT NULL,
   ascii_name VARCHAR2(128) NOT NULL,
   country_name VARCHAR2(128) NOT NULL,
   PRIMARY KEY(id_city)
);

CREATE TABLE RATINGS (
   id_rating VARCHAR2(30) NOT NULL,
   id_photo VARCHAR2(60) NOT NULL,
   rating NUMBER(4) NOT NULL,
   voter VARCHAR(64) NOT NULL,
   CONSTRAINT fk_photo
    PRIMARY KEY(id_rating),
    FOREIGN KEY (id_photo) REFERENCES PHOTO(id_photo)
);

/*end of tables*/

INSERT INTO CATEGORIES VALUES ('Film és animáció');
INSERT INTO CATEGORIES VALUES ('Autók és más járművek');
INSERT INTO CATEGORIES VALUES ('Zene');
INSERT INTO CATEGORIES VALUES ('Házi kedvencek és egyéb állatok');
INSERT INTO CATEGORIES VALUES ('Sport');
INSERT INTO CATEGORIES VALUES ('Utazás és események');
INSERT INTO CATEGORIES VALUES ('Játék');
INSERT INTO CATEGORIES VALUES ('Emberek és blogok');
INSERT INTO CATEGORIES VALUES ('Humor');
INSERT INTO CATEGORIES VALUES ('Szórakozás');
INSERT INTO CATEGORIES VALUES ('Hírek és politika');
INSERT INTO CATEGORIES VALUES ('Útmutatók és stílus');
INSERT INTO CATEGORIES VALUES ('Tudomány és technika');
INSERT INTO CATEGORIES VALUES ('Nonprofit szervezet');