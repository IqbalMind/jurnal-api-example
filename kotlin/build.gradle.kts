plugins {
    kotlin("jvm") version "1.9.22"
    application
}

group = "com.mekari"
version = "1.0.0"

repositories {
    mavenCentral()
}

application {
    mainClass.set("com.mekari.jurnal.MainKt")
}

kotlin {
    jvmToolchain(17)
}
