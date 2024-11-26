# Use an official Java runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend project into the container
COPY ./backend /app

# Build the project (if needed, replace this with your build tool)
RUN ./mvnw clean package

# Run the Spring Boot app
CMD ["java", "-jar", "target/backend.jar"]