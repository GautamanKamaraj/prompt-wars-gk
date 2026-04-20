import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const INITIAL_SECONDS = 252; // 04:12

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ProofOfLifeAlarm() {
  const [permission] = useCameraPermissions();
  const [mathFallback, setMathFallback] = useState(false);
  const [timerLeft, setTimerLeft] = useState(INITIAL_SECONDS);
  const [showMathInput, setShowMathInput] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const cameraRef = useRef<CameraView>(null);
  // Use a ref so the cleanup callback always has the latest sound instance
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    playAlarmSound();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    const timer = setInterval(() => {
      setTimerLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      soundRef.current?.unloadAsync();
    };
  }, []);

  async function playAlarmSound() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://cdn.freesound.org/previews/316/316847_3287232-lq.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      soundRef.current = sound;
    } catch (e) {
      console.log('Failed to load audio', e);
    }
  }

  const handleDismiss = async () => {
    if (soundRef.current) await soundRef.current.stopAsync();
    Alert.alert("Authentication Complete", "Solaris has verified your wake state.");
    router.replace('/');
  };

  const captureProofOfLife = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) handleDismiss();
    } catch (err) {
      setMathFallback(true);
    }
  };

  const handleMathFallback = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt("Solaris Protocol", "What is 8 × 7?", [
        {
          text: 'Submit',
          onPress: (text) => {
            if (text === '56') handleDismiss();
            else Alert.alert("Access Denied", "The awakening sequence continues.");
          },
        },
      ]);
    } else {
      setMathAnswer('');
      setShowMathInput(true);
    }
  };

  const submitMathAnswer = () => {
    setShowMathInput(false);
    if (mathAnswer.trim() === '56') {
      handleDismiss();
    } else {
      Alert.alert("Access Denied", "The awakening sequence continues.");
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted && !mathFallback) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#93000a', '#3f0e00']} style={StyleSheet.absoluteFill} />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={64} color="#ffb4ab" style={{ marginBottom: 24 }} />
          <Text style={styles.urgentText}>VERIFICATION REQUIRED.</Text>
          <Text style={styles.subText}>Camera access was denied.</Text>
          <TouchableOpacity style={styles.snapButtonFallback} onPress={handleMathFallback}>
            <Text style={styles.snapTextFallback}>INITIATE COGNITIVE TEST</Text>
          </TouchableOpacity>
        </View>
        {showMathInput && (
          <View style={styles.mathOverlay}>
            <Text style={styles.mathQuestion}>What is 8 × 7?</Text>
            <TextInput
              style={styles.mathInput}
              keyboardType="numeric"
              value={mathAnswer}
              onChangeText={setMathAnswer}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitMathAnswer}
            />
            <TouchableOpacity style={styles.mathSubmitBtn} onPress={submitMathAnswer}>
              <Text style={styles.mathSubmitText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" ref={cameraRef}>

        {/* Layer 1: Ambient Overlay */}
        <LinearGradient
          colors={['rgba(14,14,53,0.9)', 'rgba(37,38,76,0.3)', 'rgba(14,14,53,0.95)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.overlay}>

          <View style={styles.topSection}>
            <Text style={styles.subtext}>Solaris Protocol</Text>
            <Text style={styles.heroText}>PROVE YOU ARE AWAKE</Text>

            <BlurView intensity={20} tint="dark" style={styles.timerCard}>
              <Text style={styles.timerLabel}>ALARM ESCALATION IN</Text>
              <Text style={styles.timerValue}>{formatTime(timerLeft)}</Text>
            </BlurView>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.captureContainer}>
              <Animated.View style={[
                styles.capturePulse,
                {
                  transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
                  opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
                }
              ]} />

              <TouchableOpacity onPress={captureProofOfLife}>
                <LinearGradient
                  colors={['#ffb59d', '#e65924']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.captureButton}
                >
                  <MaterialIcons name="camera-alt" size={32} color="#390c00" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.captureHelp}>Scan face to terminate alarm</Text>
          </View>

        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e35' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 24, paddingTop: 80, paddingBottom: 60 },
  topSection: { alignItems: 'center' },
  subtext: { color: '#eebd97', fontSize: 12, fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
  heroText: { fontSize: 32, fontWeight: '900', color: '#ffb59d', letterSpacing: 1, marginBottom: 40, textShadowColor: 'rgba(255, 181, 157, 0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, textAlign: 'center' },
  timerCard: { backgroundColor: 'rgba(22, 23, 61, 0.6)', borderRadius: 32, padding: 32, paddingHorizontal: 48, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  timerLabel: { color: '#c8c5cf', fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 1 },
  timerValue: { fontSize: 64, fontWeight: '900', color: '#ffb59d', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  bottomSection: { alignItems: 'center' },
  captureContainer: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  capturePulse: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#ffb59d' },
  captureButton: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10 },
  captureHelp: { color: '#e1e0ff', fontSize: 14, fontWeight: '500', letterSpacing: 0.5 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  urgentText: { fontSize: 32, color: '#ffb4ab', fontWeight: '900', marginBottom: 10, textAlign: 'center', letterSpacing: 2 },
  subText: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 40, textAlign: 'center' },
  snapButtonFallback: { backgroundColor: 'rgba(147, 0, 10, 0.5)', borderWidth: 1, borderColor: '#ffb4ab', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 32 },
  snapTextFallback: { color: '#ffb4ab', fontWeight: '800', letterSpacing: 1 },
  mathOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14,14,53,0.97)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  mathQuestion: { color: '#ffb59d', fontSize: 24, fontWeight: '900', marginBottom: 24, textAlign: 'center' },
  mathInput: { width: '100%', backgroundColor: '#1a1b41', color: '#e1e0ff', fontSize: 32, fontWeight: '900', textAlign: 'center', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,181,157,0.3)' },
  mathSubmitBtn: { backgroundColor: '#ffb59d', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 32 },
  mathSubmitText: { color: '#390c00', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});
