package com.aadarshlokhande.productive

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.os.Build
import android.util.Log

class PackageInstallerStatusReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)
    val statusMessage =
      intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE) ?: "Unknown install status"

    when (status) {
      PackageInstaller.STATUS_PENDING_USER_ACTION -> {
        val confirmationIntent = extractConfirmationIntent(intent)
        if (confirmationIntent != null) {
          confirmationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          context.startActivity(confirmationIntent)
        } else {
          Log.e(TAG, "Installer pending user action but no confirmation intent was provided.")
        }
      }

      PackageInstaller.STATUS_SUCCESS -> {
        Log.i(TAG, "APK install session committed successfully.")
      }

      else -> {
        Log.e(TAG, "APK install failed with status=$status message=$statusMessage")
      }
    }
  }

  @Suppress("DEPRECATION")
  private fun extractConfirmationIntent(intent: Intent): Intent? {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      intent.getParcelableExtra(Intent.EXTRA_INTENT, Intent::class.java)
    } else {
      intent.getParcelableExtra(Intent.EXTRA_INTENT) as? Intent
    }
  }

  companion object {
    const val ACTION_INSTALL_STATUS = "com.aadarshlokhande.productive.ACTION_INSTALL_STATUS"
    private const val TAG = "ProductiveInstaller"
  }
}
