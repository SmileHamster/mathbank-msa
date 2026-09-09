# 빌드 스테이지
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# 실행 스테이지
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Xms64m", "-Xmx180m", "-XX:+UseSerialGC", "-XX:MaxMetaspaceSize=100m", "-Xss228k", "-XX:ReservedCodeCacheSize=48m", "-XX:CICompilerCount=2", "-jar", "app.jar"]
