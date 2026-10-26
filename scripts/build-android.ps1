# scripts/build-android.ps1
# Automates Android APK build for KAI Japanese Mastery using the local Android SDK and JDK 21

$ErrorActionPreference = "Stop"

Write-Host "==> Resolving Java Development Kit (JDK 21)..." -ForegroundColor Cyan
if (Test-Path "$env:USERPROFILE\.jdks\jbr-21.0.11") {
    $env:JAVA_HOME = "$env:USERPROFILE\.jdks\jbr-21.0.11"
} elseif (Test-Path "C:\Program Files\Android\Android Studio\jbr") {
    $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
} else {
    Write-Warning "Could not find auto-detected JDK. Using system default if configured."
}

Write-Host "==> Resolving Android SDK..." -ForegroundColor Cyan
if (Test-Path "$env:LOCALAPPDATA\Android\Sdk") {
    $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
} else {
    Write-Warning "Could not find Android SDK at $env:LOCALAPPDATA\Android\Sdk."
}

Write-Host "==> Building Android Debug APK with Gradle..." -ForegroundColor Green
& ".\android\gradlew.bat" -p android assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "==> SUCCESS: Android APK compiled to android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Green
} else {
    Write-Error "Gradle build failed with exit code $LASTEXITCODE"
}
