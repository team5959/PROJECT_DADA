# production stage

FROM openjdk:11-jre-slim

COPY ./build/libs/dada-0.0.1.jar .

EXPOSE 8080
CMD ["java", "-jar", "-Dspring.profiles.active=prod", "dada-0.0.1.jar"]
