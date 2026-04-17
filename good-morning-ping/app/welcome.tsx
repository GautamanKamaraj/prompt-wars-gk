import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoGlowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoGlowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(logoGlowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start(),
    ]).start();
  }, []);

  const handleStart = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0e0e35', '#16173d', '#0e0e35']} style={StyleSheet.absoluteFill} />
      
      {/* Background Ambient Glows */}
      <View style={[styles.glow, { top: -100, left: -50, backgroundColor: 'rgba(255, 181, 157, 0.15)' }]} />
      <View style={[styles.glow, { bottom: -100, right: -50, backgroundColor: 'rgba(230, 89, 36, 0.1)' }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
            <Animated.View style={[styles.logoGlow, { opacity: logoGlowAnim }]} />
            <LinearGradient colors={['#ffb59d', '#e65924']} style={styles.logoCircle}>
                <MaterialIcons name="wb-sunny" size={60} color="#390c00" />
            </LinearGradient>
        </View>

        <Text style={styles.brandName}>SOLARIS</Text>
        <Text style={styles.tagline}>AWAKENING</Text>
        
        <View style={styles.descriptionBox}>
            <Text style={styles.description}>
                The next generation of social accountability. 
                Bypass silence. Trigger safety. 
                Never let your circle miss a beat.
            </Text>
        </View>

        <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleStart} 
            style={styles.buttonContainer}
        >
            <LinearGradient 
                colors={['#ffb59d', '#e65924']} 
                start={{x:0, y:0}} 
                end={{x:1, y:1}} 
                style={styles.button}
            >
                <Text style={styles.buttonText}>GET STARTED</Text>
                <MaterialIcons name="chevron-right" size={24} color="#390c00" />
            </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>SECURED BY EMERGENCY RADAR</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e35', justifyContent: 'center', alignItems: 'center' },
  glow: { position: 'absolute', width: 300, height: 300, borderRadius: 150, filter: 'blur(80px)' as any },
  content: { width: '100%', alignItems: 'center', paddingHorizontal: 40 },
  logoContainer: { position: 'relative', marginBottom: 24, justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  logoGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255, 181, 157, 0.3)', filter: 'blur(30px)' as any },
  brandName: { fontSize: 42, fontWeight: '900', color: '#ffb59d', letterSpacing: 8, marginTop: 10 },
  tagline: { fontSize: 14, fontWeight: 'bold', color: '#e1e0ff', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 30 },
  descriptionBox: { marginBottom: 50 },
  description: { fontSize: 16, color: '#918f99', textAlign: 'center', lineHeight: 24, fontWeight: '500' },
  buttonContainer: { width: '100%', shadowColor: '#e65924', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.3, shadowRadius: 25 },
  button: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, borderRadius: 20, gap: 10 },
  buttonText: { fontSize: 18, fontWeight: '900', color: '#390c00', letterSpacing: 2 },
  footerText: { marginTop: 40, fontSize: 10, fontWeight: 'bold', color: '#42436b', letterSpacing: 2, textTransform: 'uppercase' }
});
