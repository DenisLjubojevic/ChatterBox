# Use an official Maven image for building
FROM maven:3.8-openjdk-17-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the backend files into the container
COPY ./backend /app

# Build the backend using Maven
RUN mvn clean package -DskipTests

# Use OpenJDK to run the application
FROM openjdk:23-jdk-slim

WORKDIR /app

# Copy the JAR from the builder image
COPY --from=builder /app/target/*.jar /app/backend.jar

# Command to run the app
CMD ["java", "-jar", "backend.jar"]