package com.aadarshlokhande.productive

import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageInstaller
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileInputStream

class ApkInstallerModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ApkInstaller"

  @ReactMethod
  fun canRequestPackageInstalls(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
        promise.resolve(true)
        return
      }
      promise.resolve(reactContext.packageManager.canRequestPackageInstalls())
    } catch (e: Exception) {
      promise.reject("INSTALL_PERMISSION_CHECK_FAILED", e.message, e)
    }
  }

  @ReactMethod
  fun openInstallUnknownAppsSettings(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val intent = Intent(
          Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
          Uri.parse("package:${reactContext.packageName}")
        ).apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactContext.startActivity(intent)
      }
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("OPEN_INSTALL_SETTINGS_FAILED", e.message, e)
    }
  }

  @ReactMethod
  fun installApk(apkPath: String, promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
        !reactContext.packageManager.canRequestPackageInstalls()
      ) {
        promise.reject(
          "INSTALL_PERMISSION_REQUIRED",
          "Install unknown apps permission is not granted for this app."
        )
        return
      }

      val normalizedPath = normalizePath(apkPath)
      val apkFile = File(normalizedPath)
      if (!apkFile.exists()) {
        promise.reject("APK_NOT_FOUND", "APK not found at path: $normalizedPath")
        return
      }

      val installer = reactContext.packageManager.packageInstaller
      val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL).apply {
        setSize(apkFile.length())
      }

      val sessionId = installer.createSession(params)
      var session: PackageInstaller.Session? = null

      try {
        session = installer.openSession(sessionId)
        FileInputStream(apkFile).use { input ->
          session.openWrite("base.apk", 0, apkFile.length()).use { output ->
            val buffer = ByteArray(64 * 1024)
            var read = input.read(buffer)
            while (read >= 0) {
              if (read > 0) {
                output.write(buffer, 0, read)
              }
              read = input.read(buffer)
            }
            session.fsync(output)
          }
        }

        val callbackIntent = Intent(PackageInstallerStatusReceiver.ACTION_INSTALL_STATUS).setPackage(
          reactContext.packageName
        )
        val pendingIntentFlags =
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
          } else {
            PendingIntent.FLAG_UPDATE_CURRENT
          }

        val pendingIntent =
          PendingIntent.getBroadcast(reactContext, sessionId, callbackIntent, pendingIntentFlags)

        session.commit(pendingIntent.intentSender)

        val result = Arguments.createMap().apply {
          putInt("sessionId", sessionId)
          putString("status", "commit_sent")
        }
        promise.resolve(result)
      } catch (e: Exception) {
        session?.abandon()
        promise.reject("APK_INSTALL_FAILED", e.message, e)
      } finally {
        session?.close()
      }
    } catch (e: Exception) {
      promise.reject("APK_INSTALL_FAILED", e.message, e)
    }
  }

  private fun normalizePath(path: String): String {
    if (path.startsWith("file://")) {
      val uriPath = Uri.parse(path).path
      if (!uriPath.isNullOrBlank()) return uriPath
      return path.removePrefix("file://")
    }
    return path
  }
}
