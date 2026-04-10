package com.aadarshlokhande.productive

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews

class ProductiveWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
    for (widgetId in appWidgetIds) {
      appWidgetManager.updateAppWidget(widgetId, buildRemoteViews(context))
    }
  }

  companion object {
    private const val PREFS_NAME = "productive_widget_prefs"
    private const val KEY_WEEKLY_SCORE = "weekly_score"
    private const val KEY_WEEKLY_STREAK = "weekly_streak"
    private const val KEY_LEVEL = "level"
    private const val XP_GOAL = 500

    fun updateSnapshot(context: Context, weeklyScore: Int, weeklyStreak: Int, currentLevel: String) {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      prefs.edit()
        .putInt(KEY_WEEKLY_SCORE, weeklyScore.coerceAtLeast(0))
        .putInt(KEY_WEEKLY_STREAK, weeklyStreak.coerceAtLeast(0))
        .putString(KEY_LEVEL, currentLevel)
        .apply()

      refreshWidgets(context)
    }

    fun refreshWidgets(context: Context) {
      val appWidgetManager = AppWidgetManager.getInstance(context)
      val componentName = ComponentName(context, ProductiveWidgetProvider::class.java)
      val widgetIds = appWidgetManager.getAppWidgetIds(componentName)
      if (widgetIds.isNotEmpty()) {
        val views = buildRemoteViews(context)
        widgetIds.forEach { appWidgetManager.updateAppWidget(it, views) }
      }
    }

    private fun buildRemoteViews(context: Context): RemoteViews {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      val weeklyScore = prefs.getInt(KEY_WEEKLY_SCORE, 0)
      val weeklyStreak = prefs.getInt(KEY_WEEKLY_STREAK, 0)
      val level = prefs.getString(KEY_LEVEL, context.getString(R.string.widget_default_level))
        ?: context.getString(R.string.widget_default_level)

      val progressPercent = ((weeklyScore.toFloat() / XP_GOAL) * 100f).toInt().coerceIn(0, 100)

      val views = RemoteViews(context.packageName, R.layout.widget_productive_glance)
      views.setTextViewText(R.id.widget_title, context.getString(R.string.widget_title))
      views.setTextViewText(
        R.id.widget_streak,
        context.getString(R.string.widget_streak_format, weeklyStreak)
      )
      views.setTextViewText(R.id.widget_level, level)
      views.setTextViewText(
        R.id.widget_xp,
        context.getString(R.string.widget_xp_format, weeklyScore, XP_GOAL)
      )
      views.setProgressBar(R.id.widget_progress, 100, progressPercent, false)

      val launchIntent = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      }

      val pendingIntentFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      } else {
        PendingIntent.FLAG_UPDATE_CURRENT
      }

      val launchPendingIntent = PendingIntent.getActivity(
        context,
        0,
        launchIntent,
        pendingIntentFlags
      )
      views.setOnClickPendingIntent(R.id.widget_root, launchPendingIntent)

      return views
    }
  }
}
