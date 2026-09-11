/**
 * SG Maker Dual APK & Android Bundle Service
 * Generates installable WebAPK packages, AndroidManifests, and triggers browser installations
 */

export interface ApkMetadata {
  id: 'public' | 'admin';
  name: string;
  shortName: string;
  packageName: string;
  version: string;
  versionCode: number;
  themeColor: string;
  startUrl: string;
  iconSrc: string;
  description: string;
}

export const APK_CONFIGS: Record<'public' | 'admin', ApkMetadata> = {
  public: {
    id: 'public',
    name: 'SG Maker - Gaming Studio & Accessories',
    shortName: 'SG Maker',
    packageName: 'com.sgmaker.gamer',
    version: '1.2.0',
    versionCode: 120,
    themeColor: '#10b981',
    startUrl: '/?mode=public',
    iconSrc: '/icon-512.png',
    description: 'Official Gamer & Customer App - Shop accessories, order COD, and book game dev studio services.'
  },
  admin: {
    id: 'admin',
    name: 'SG Maker Admin - Studio Operations',
    shortName: 'SGM Admin',
    packageName: 'com.sgmaker.admin',
    version: '1.2.0',
    versionCode: 120,
    themeColor: '#06b6d4',
    startUrl: '/?mode=admin',
    iconSrc: '/admin-icon-512.png',
    description: 'Studio Operations & Management Portal for Sufisoft Developer (sufisoft63@gmail.com).'
  }
};

/**
 * Dynamically switches the document's PWA manifest based on the target edition
 */
export function setDocumentManifest(mode: 'public' | 'admin') {
  let manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (!manifestLink) {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    document.head.appendChild(manifestLink);
  }
  manifestLink.href = mode === 'admin' ? '/manifest-admin.json' : '/manifest-public.json';

  // Update theme-color meta tag
  const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = mode === 'admin' ? '#06b6d4' : '#10b981';
  }
}

/**
 * Generates an AndroidManifest.xml string for native TWA / Capacitor compilation
 */
export function generateAndroidManifest(config: ApkMetadata): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}"
    android:versionCode="${config.versionCode}"
    android:versionName="${config.version}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.name}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true"
            android:label="${config.name}"
            android:theme="@android:style/Theme.Translucent.NoTitleBar">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- TWA / WebAPK URL Association -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="${window.location.hostname}"
                    android:pathPrefix="${config.startUrl}" />
            </intent-filter>

            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="${window.location.origin}${config.startUrl}" />
            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimary" />
            <meta-data
                android:name="android.support.customtabs.trusted.NAVIGATION_BAR_COLOR"
                android:resource="@color/navigationColor" />
        </activity>
    </application>
</manifest>`;
}

/**
 * Trigger download of the configuration & instructions package
 */
export function downloadApkPackage(type: 'public' | 'admin') {
  const config = APK_CONFIGS[type];
  const manifestXml = generateAndroidManifest(config);
  
  const packageData = {
    appEdition: config.name,
    packageName: config.packageName,
    version: config.version,
    versionCode: config.versionCode,
    startUrl: `${window.location.origin}${config.startUrl}`,
    themeColor: config.themeColor,
    installType: 'Android WebAPK / TWA Native Wrapper',
    androidManifestXml: manifestXml,
    howToInstall: [
      "Option 1 (Instant Phone Install): Open this page on Google Chrome or Samsung Internet on Android, tap 'Install App' or 'Add to Home screen' from the menu.",
      "Option 2 (PWABuilder 1-Click APK): Visit pwabuilder.com, paste your app URL with '?mode=" + type + "', and click 'Generate Android APK' to get an immediate signed APK.",
      "Option 3 (Android Studio): Use the included AndroidManifest.xml in a standard TWA template."
    ]
  };

  const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SG-Maker-${type === 'admin' ? 'Admin-Portal' : 'Public-Gamer'}-APK-Bundle.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
