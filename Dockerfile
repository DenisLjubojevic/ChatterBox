# Use an official Maven image for building
FROM maven:3.8-openjdk-23-slim AS builder

# Set the working directory
WORKDIR /app/backend

# Copy only the pom.xml first to leverage Docker cache
COPY ./backend/pom.xml /app/backend/pom.xml

# Install dependencies without building the project
RUN mvn clean install -DskipTests

# Now copy the full source code and build
COPY ./backend /app/backend

# Build the backend using Maven and make sure to install dependencies and package it
RUN mvn clean install -DskipTests

# Use OpenJDK to run the application
FROM openjdk:23-jdk-slim

WORKDIR /app

# Copy the JAR from the builder image
COPY --from=builder /app/backend/target/*.jar /app/backend.jar

# Command to run the app
CMD ["java", "-jar", "backend.jar"]
