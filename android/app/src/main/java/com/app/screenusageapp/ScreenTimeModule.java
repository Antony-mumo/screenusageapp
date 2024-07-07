package com.app.screenusageapp;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class ScreenTimeModule extends ReactContextBaseJavaModule {

    public ScreenTimeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ScreenTimeModule";
    }

    @ReactMethod
    public void getUsage(Promise promise) {
        UsageStatsManager usageStatsManager = (UsageStatsManager) getReactApplicationContext().getSystemService(Context.USAGE_STATS_SERVICE);
        if (usageStatsManager == null) {
            promise.reject("UsageStatsManager is not available");
            return;
        }
        long endTime = System.currentTimeMillis();
        long startTime = endTime - TimeUnit.DAYS.toMillis(1);
        List<UsageStats> usageStatsList = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
        Map<String, Long> usageMap = new HashMap<>();

        for (UsageStats usageStats : usageStatsList) {
            usageMap.put(usageStats.getPackageName(), usageStats.getTotalTimeInForeground());
        }

        promise.resolve(usageMap);
    }
}
