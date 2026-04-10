package com.aadarshlokhande.productive

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ProductiveWidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = "ProductiveWidget"

  @ReactMethod
  fun updateSnapshot(weeklyScore: Int, weeklyStreak: Int, currentLevel: String?) {
    val safeLevel = currentLevel?.ifBlank { "Getting Started" } ?: "Getting Started"
    ProductiveWidgetProvider.updateSnapshot(
      reactApplicationContext,
      weeklyScore,
      weeklyStreak,
      safeLevel
    )
  }

  @ReactMethod
  fun refresh() {
    ProductiveWidgetProvider.refreshWidgets(reactApplicationContext)
  }
}
