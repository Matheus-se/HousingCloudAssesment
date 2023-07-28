-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "zip" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "coordinates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "campus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "coordinateId" TEXT NOT NULL,
    CONSTRAINT "campus_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "campus_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "coordinates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "houseUnitId" TEXT,
    CONSTRAINT "interests_houseUnitId_fkey" FOREIGN KEY ("houseUnitId") REFERENCES "houseUnits" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "houseUnits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'No description provided',
    "price" REAL NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "addressId" TEXT NOT NULL,
    "coordinateId" TEXT NOT NULL,
    CONSTRAINT "houseUnits_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "houseUnits_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "coordinates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
