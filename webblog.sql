-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.0.7
-- PostgreSQL version: 16.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: new_database | type: DATABASE --
-- DROP DATABASE IF EXISTS new_database;
CREATE DATABASE new_database;
-- ddl-end --

-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
	pk SERIAL PRIMARY KEY,
	username varchar(100),
	password varchar(500)
);
-- ddl-end --

-- object: public.posts | type: TABLE --
-- DROP TABLE IF EXISTS public.posts CASCADE;
CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
	title varchar(1000),
	author varchar(1000),
    description varchar(10000),
    thumbnail bytea,
    created date,
    pk smallint NOT NULL,
    FOREIGN KEY (pk) REFERENCES public.users (pk) ON DELETE RESTRICT ON UPDATE CASCADE
);