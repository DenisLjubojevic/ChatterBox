# Use an official Maven image with OpenJDK 17 for building
FROM maven:3.8-openjdk-17-slim AS builder

# Set the working directory
WORKDIR /app/backend

# Copy the backend files into the container
COPY ./backend /app/backend

# Build the backend using Maven and make sure to install dependencies and package it
RUN mvn clean install -DskipTests

# Use OpenJDK 17 for running the app (or use any other version that fits)
FROM openjdk:17-jdk-slim

WORKDIR /app

VOLUME /app/backend/uploads/images

# Copy the JAR from the builder image
COPY --from=builder /app/backend/target/*.jar /app/backend.jar

# Command to run the app
CMD ["java", "-jar", "backend.jar"]
