### Screen Usage App Documentation

---

## Overview

The Screen Usage App is a React Native application designed to monitor and report the usage of applications on a mobile device. This app is built for both Android and iOS platforms, utilizing native modules to access device-specific functionality.

---

## Features

- Monitor screen time usage for each application on the device.
- Retrieve usage statistics for the last 24 hours.
- Display usage data in a user-friendly interface.
- Refresh and update usage data on demand.

---

## Project Structure

### 1. `MainApplication.java`

This file is the main entry point for the Android application. It extends the `Application` class and implements the `ReactApplication` interface.

#### Key Responsibilities:

- Initializes the React Native host.
- Registers the `ScreenTimePackage`.
- Handles application lifecycle events.

```java
package com.app.screenusageapp;

import android.app.Application;
import android.content.res.Configuration;
import androidx.annotation.NonNull;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ReactNativeHostWrapper;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
    new ReactNativeHostWrapper(this, new DefaultReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        // Add the ScreenTimePackage manually here
        packages.add(new ScreenTimePackage());
        return packages;
      }

      @Override
      protected String getJSMainModuleName() {
        return "index";
      }

      @Override
      protected boolean isNewArchEnabled() {
        return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      }

      @Override
      protected Boolean isHermesEnabled() {
        return BuildConfig.IS_HERMES_ENABLED;
      }
  });

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    ApplicationLifecycleDispatcher.onApplicationCreate(this);
  }

  @Override
  public void onConfigurationChanged(@NonNull Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig);
  }
}
```

### 2. `ScreenTimeModule.java`

This file defines the native module for Android that provides screen time usage data.

#### Key Responsibilities:

- Retrieves usage statistics from the `UsageStatsManager`.
- Formats the usage data and resolves it via a promise.

```java
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
```

### 3. `ScreenTimePackage.java`

This file defines the React package that includes the `ScreenTimeModule`.

#### Key Responsibilities:

- Registers the `ScreenTimeModule` with React Native.

```java
package com.app.screenusageapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ScreenTimePackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ScreenTimeModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```

### 4. JavaScript Integration (`usage.js`)

This file handles the JavaScript side of the module, providing a function to get the usage data.

#### Key Responsibilities:

- Exposes a function to retrieve usage data from the native module.

```javascript
import { NativeModules } from 'react-native';

const { ScreenTimeModule } = NativeModules;

export const getUsage = async () => {
    if (!ScreenTimeModule) {
        console.error('ScreenTimeModule is not available');
        return;
    }
    try {
        const usage = await ScreenTimeModule.getUsage();
        console.log('Screen Time Usage:', usage);
        return usage;
    } catch (error) {
        console.error('Error getting screen time usage:', error);
    }
};
```

### 5. User Interface (`HomeScreen.js`)

This file defines the main screen of the app, which displays the usage data.

#### Key Responsibilities:

- Fetches usage data and displays it in a picker.
- Allows users to refresh the usage data.

```javascript
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Picker } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUsage } from '../components/usage';

const HomeScreen = () => {
    const [usageData, setUsageData] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [apps, setApps] = useState([]);

    const fetchUsage = useCallback(async () => {
        const usage = await getUsage();
        if (usage) {
            setUsageData(usage);
            setApps(Object.keys(usage));
        }
    }, []);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Button title="Refresh Usage Data" onPress={fetchUsage} />
                {usageData ? (
                    <View>
                        <Picker
                            selectedValue={selectedApp}
                            onValueChange={(itemValue) => setSelectedApp(itemValue)}
                        >
                            {apps.map((app) => (
                                <Picker.Item key={app} label={app} value={app} />
                            ))}
                        </Picker>
                        {selectedApp && (
                            <Text style={styles.usageText}>{`${selectedApp}: ${usageData[selectedApp]} ms`}</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    usageText: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default HomeScreen;
```

### Permissions

Ensure you have the necessary permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />
```

---

## Conclusion

This documentation provides an overview of the Screen Usage App, including its features, project structure, and detailed descriptions of key files. The app monitors and reports screen time usage for applications on a mobile device, utilizing both Android and iOS native modules to access device-specific functionality.
