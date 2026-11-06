import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import { File } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import jpeg from 'jpeg-js';
import { matchesEmoji } from '../models/Emoji';

let cachedModel: Promise<mobilenet.MobileNet> | undefined;
function loadModel() {
  return cachedModel ??= (async () => {
    await tf.ready();
    return mobilenet.load();
  })().catch(error => { cachedModel = undefined; throw error; });
}

type Props = {
  emojiNames: string[];
  onEmojiFound: () => void;
  onTensorLoaded: (ready: boolean) => void;
};

export default function CustomCamera({ emojiNames, onEmojiFound, onTensorLoaded }: Props) {
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState<mobilenet.MobileNet>();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!Device.isDevice || !permission?.granted) return;
    let cancelled = false;
    loadModel().then(value => { if (!cancelled) setModel(value); })
      .catch(() => { if (!cancelled) setError('Could not load MobileNet. Check your internet connection and retry.'); });
    return () => { cancelled = true; };
  }, [permission?.granted, attempt]);

  useEffect(() => {
    onTensorLoaded(Boolean(model && ready && !error));
    return () => onTensorLoaded(false);
  }, [model, ready, error, onTensorLoaded]);

  useEffect(() => {
    if (!model || !ready || error) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    async function classifyFrame() {
      let photoUri: string | undefined;
      let resizedUri: string | undefined;
      let tensor: tf.Tensor3D | undefined;
      try {
        const photo = await camera.current?.takePictureAsync({ shutterSound: false, quality: 0.3 });
        photoUri = photo?.uri;
        if (!photoUri || cancelled) return;
        const resized = await manipulateAsync(photoUri, [{ resize: { width: 224, height: 224 } }], { format: SaveFormat.JPEG });
        resizedUri = resized.uri;
        const bytes = await new File(resizedUri).bytes();
        const { width, height, data } = jpeg.decode(bytes, { useTArray: true, formatAsRGBA: false });
        tensor = tf.tensor3d(new Uint8Array(data), [height, width, 3]);
        if (cancelled) return;
        const predictions = await model!.classify(tensor);
        if (__DEV__) console.log('Predictions:', predictions);
        if (!cancelled && matchesEmoji(predictions, emojiNames)) {
          onEmojiFound();
          return;
        }
      } catch (cause) {
        if (!cancelled) {
          console.error('Frame classification failed:', cause);
          setError('Camera classification failed. Retry to continue this round.');
          return;
        }
      } finally {
        tensor?.dispose();
        for (const uri of new Set([photoUri, resizedUri])) {
          if (uri) {
            try { const file = new File(uri); if (file.exists) file.delete(); }
            catch (cause) { console.warn('Could not remove temporary frame:', cause); }
          }
        }
      }
      if (!cancelled) timeout = setTimeout(classifyFrame, 1000);
    }
    timeout = setTimeout(classifyFrame, 1000);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [model, ready, error, emojiNames, onEmojiFound]);

  if (!Device.isDevice) return (
    <View style={styles.center}>
      <Text style={styles.title}>Ready for the real world</Text>
      <Text style={styles.message}>This simulator has no camera. Open Emoji Hunter on a physical phone to find real objects.</Text>
      <Text style={styles.note}>The countdown waits for the camera and model.</Text>
    </View>
  );
  if (!permission?.granted) return (
    <View style={styles.center}>
      <Text style={styles.title}>Let’s hunt for emojis</Text>
      <Text style={styles.message}>Allow the camera to identify objects on your phone. Photos stay on your device.</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => {
        if (permission?.canAskAgain === false) void Linking.openSettings();
        else void requestPermission().catch(() => setError('Could not request camera access. Open Settings to allow access.'));
      }}><Text style={styles.buttonText}>{permission?.canAskAgain === false ? 'Open Settings' : 'Allow camera'}</Text></Pressable>
      {error ? <Text style={styles.message}>{error}</Text> : null}
    </View>
  );
  return (
    <View style={styles.container}>
      <CameraView key={attempt} ref={camera} style={StyleSheet.absoluteFill} facing="back"
        onCameraReady={() => setReady(true)} onMountError={() => setError('Camera could not start. Please retry.')} />
      {(!model || !ready || error) && <View style={styles.center}>
        <Text style={styles.message}>{error || 'Preparing camera and MobileNet…'}</Text>
        {error ? <Pressable accessibilityRole="button" style={styles.button} onPress={() => {
          setReady(false); setError(''); setAttempt(value => value + 1);
        }}><Text style={styles.buttonText}>Retry</Text></Pressable> : null}
      </View>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, paddingBottom: 170, backgroundColor: '#111827' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  message: { color: '#e5e7eb', fontSize: 17, textAlign: 'center', lineHeight: 25 },
  note: { color: '#b9c5d7', fontSize: 14, textAlign: 'center', marginTop: 16 },
  button: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 24 },
  buttonText: { color: '#111827', fontSize: 17, fontWeight: '700' },
});
