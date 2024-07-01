FROM alpine/java:18-jdk
COPY ./target/survey_sharing_backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT java -jar backend.jar