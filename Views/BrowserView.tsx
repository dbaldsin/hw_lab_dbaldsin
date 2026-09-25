import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Platform, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import BottomBarIcon from '../Components/BottomBarIcon';
import type { BottomBarIconProps } from '../types';

const HOME_URL = 'https://www.google.com';

function normalizeAddress(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) return null;
  return `https://${trimmed}`;
}

export default function BrowserView() {
  const webViewRef = useRef<WebView>(null);
  const [url, setUrl] = useState(HOME_URL);
  const [currentUrl, setCurrentUrl] = useState(HOME_URL);
  const [pageUrl, setPageUrl] = useState(HOME_URL);
  const [isEditing, setIsEditing] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadUrl = () => {
    const normalized = normalizeAddress(url);
    if (!normalized) {
      Alert.alert('Invalid address', 'Enter an http or https website address.');
      return;
    }
    Keyboard.dismiss();
    setIsEditing(false);
    setUrl(normalized);
    setCurrentUrl(normalized);
    setPageUrl(normalized);
  };

  const handleNavigationChange = (navigation: WebViewNavigation) => {
    setPageUrl(navigation.url);
    setCanGoBack(navigation.canGoBack);
    setCanGoForward(navigation.canGoForward);
    setIsLoading(navigation.loading);
    if (!isEditing) setUrl(navigation.url);
  };

  const actions: BottomBarIconProps[] = [
    { iconName: 'arrow-back', size: 24, label: 'Back', onPress: () => webViewRef.current?.goBack(), disabled: !canGoBack },
    { iconName: 'arrow-forward', size: 24, label: 'Forward', onPress: () => webViewRef.current?.goForward(), disabled: !canGoForward },
    { iconName: Platform.OS === 'ios' ? 'share-outline' : 'share-social-outline', size: 24, label: 'Share', onPress: () => { void Share.share(Platform.OS === 'ios' ? { url: pageUrl } : { message: pageUrl }); } },
    { iconName: 'refresh', size: 24, label: 'Refresh', onPress: () => webViewRef.current?.reload() },
    { iconName: 'close', size: 24, label: 'Cancel', onPress: () => { webViewRef.current?.stopLoading(); setIsLoading(false); }, disabled: !isLoading },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.urlBar}>
        <View style={styles.addressField}>
          <Text style={styles.label}>URL:</Text>
          <TextInput
            accessibilityLabel="Website address"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            selectTextOnFocus
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            onChangeText={setUrl}
            onSubmitEditing={handleLoadUrl}
            value={url}
            style={styles.input}
            testID="website-address"
          />
          {isLoading && <ActivityIndicator accessibilityLabel="Page loading" color="#1976d2" size="small" style={styles.spinner} />}
        </View>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webView}
        onNavigationStateChange={handleNavigationChange}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        testID="browser-webview"
      />
      <View style={styles.bottomBar} accessibilityRole="toolbar">
        {actions.map((action) => <BottomBarIcon key={action.label} {...action} />)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  urlBar: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#d7dce3' },
  addressField: { minHeight: 42, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: '#c9d1db', borderRadius: 8, backgroundColor: '#f8fafc' },
  label: { fontSize: 14, fontWeight: '700', color: '#29384d', marginRight: 7 },
  input: { flex: 1, paddingVertical: 8, fontSize: 15, color: '#172235' },
  spinner: { marginLeft: 8 },
  webView: { flex: 1, backgroundColor: '#fff' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 4, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#d7dce3' },
});
