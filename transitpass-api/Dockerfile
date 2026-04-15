# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests \
    -Dmaven.compiler.enablePreview=true \
    -q

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
RUN groupadd -r app && useradd -r -g app app
COPY --from=builder /build/target/*.jar app.jar
RUN chown app:app app.jar
USER app

# Railway injects $PORT at runtime
ENV PORT=8080
EXPOSE $PORT

ENTRYPOINT ["sh", "-c", "java --enable-preview -XX:+UseVirtualThreads -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
