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
   currentRating FLOAT NOT NULL,
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

/*insert data example*/

INSERT INTO USRS (USERNAME, PASSWORD, FULL_NAME, EMAIL, LOCATION) 
VALUES ('test','9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'test', 'test', null);
		
COMMIT WORK;			 
/* end of insert data*/			 
/*megfigyelés: mivel base64 url-ként mentem Clob-ba a képet, nem nagyon sikerült az sqldevelopernek futtatni az insertet, 
viszont a projektben már simán fel lehet tölteni a fotót*/