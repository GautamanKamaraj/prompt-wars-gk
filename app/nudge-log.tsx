import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Animated, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function NudgeLogScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const friendName = searchParams.name || 'Elena';
  const friendAvatar = searchParams.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1fDe5ooZGyN2pVlw2iwKtRv9Rbmc3TvyWLJPamSOC0EN3QeuX6xsFn24PHuhPpKkQYcHzUW-Xu5hwjVVGtBPFs4ThoSiDDjS_bCUW5ldpq0vzPOlLtqhpShuRGsCWUZgzdeWXNF-XNWn4gMFQ1TFsYvk7bsvcOArj0Ni_Aiii3ghCuKIlDrRh4pJjjODifHkH0QeBUkhj4ib6dzkbGqvS4P9jcWrZwLXVFjDkKbI7Tx0qlEeGaF5Q8NvgsHTxF99lHI7BQy0-sMMu';

  const pulseAnimOuter = useRef(new Animated.Value(0)).current;
  const pulseAnimInner = useRef(new Animated.Value(0)).current;

  const [timeLeft, setTimeLeft] = useState(252);

  useEffect(() => {
    simulateBypassPush();

    const createPulse = (anim: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, delay, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    };

    createPulse(pulseAnimInner, 2000, 0).start();
    createPulse(pulseAnimOuter, 2000, 400).start();

    const interval = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const simulateBypassPush = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('[Solaris] Notification permissions not granted');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 URGENT: WAKE UP! 🚨",
        body: "Your friend is pinging you! Wake up!",
        sound: 'siren.wav',
      },
      trigger: {
        seconds: 2,
        channelId: 'critical-wake-up',
      },
    });
  };

  const handleCancel = () => {
    Alert.alert("Nudge Cancelled", "The alarm sequence has been aborted.");
    router.replace('/');
  };

  const handleViewResponse = () => {
    Alert.alert("Awaiting Proof of Life", "Elena hasn't sent her wakeup selfie yet.");
  };

  const handleNavClick = (tabName: string) => {
    Alert.alert(`Navigate to ${tabName}`, `This feature will open the ${tabName} tab.`);
  };

  const getFormatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => Alert.alert('Profile', 'Opening Profile settings')}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUMLOUlR1_3FeHqwraa8BncX-xch-r0SkVUfLm4Hicgmkf2jab5NxQwUwmxUzdVnaHUsdQH90hFp13C7b3zFGa3fDtsAHIBztnkTcq93J2jyhucduEl9bphk9nPo3BZe7ELjnGxX3FKZ2e0Wmd_CENnIZuLB3fvsLIelza89tRFqXCAzvNaB2ogwGuDLzmgiBAhiWYRUd4LKxctzDLbdh5bSYWsocdCXQp-zIwvmtkKNQulOwyhbC6S9_6XBnNCEmDsJ9KDoKNDo62' }}
              style={{width: '100%', height:'100%'}}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.appBarTitle}>Solaris</Text>
        <TouchableOpacity style={styles.appBarRight} onPress={() => Alert.alert('Settings', 'Opening system settings')}>
          <MaterialIcons name="settings" size={24} color="#ffb59d" />
        </TouchableOpacity>
        <LinearGradient colors={['#1a1b41', 'transparent']} style={styles.appBarBorder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.heroSection}>
          <View style={styles.pulsingAvatarWrapper}>
            <Animated.View style={[
              styles.pulseOuter,
              {
                transform: [{ scale: pulseAnimOuter.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
                opacity: pulseAnimOuter.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0] })
              }
            ]} />
            <Animated.View style={[
              styles.pulseInner,
              {
                transform: [{ scale: pulseAnimInner.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }],
                opacity: pulseAnimInner.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] })
              }
            ]} />
            
            <View style={styles.avatarImageContainer}>
              <Image source={{ uri: friendAvatar as string }} style={{width:'100%', height:'100%'}} />
            </View>
          </View>

          <Text style={styles.heroGreeting}>Rise & Shine, {friendName && friendName[0] ? friendName.split(' ')[0] : 'Hero'}!</Text>
          <Text style={styles.heroSubText}>ATTEMPTING TO WAKE YOUR FRIEND</Text>

          <View style={styles.timerCard}>
            <View style={styles.timerGlow} />
            <Text style={styles.timerLabel}>Ringing Duration</Text>
            <Text style={styles.timerValue}>{getFormatTime(timeLeft)}</Text>
            
            <View style={styles.progressIndicators}>
              <View style={[styles.progressDot, { backgroundColor: '#ffb59d' }]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>
          </View>
        </View>

        <View style={styles.logSection}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>Nudge Log</Text>
            <Text style={styles.logLiveBadge}>LIVE UPDATES</Text>
          </View>

          <View style={[styles.logItem, { borderLeftColor: '#ffb59d' }]}>
            <View style={[styles.logIconWrapper, { backgroundColor: '#3f0e00' }]}>
              <MaterialIcons name="wb-sunny" size={14} color="#ffb59d" />
            </View>
            <View style={styles.logContent}>
              <Text style={styles.logItemTitle}>Solar Flare sent</Text>
              <Text style={styles.logItemTime}>2 minutes ago</Text>
            </View>
            <MaterialIcons name="check-circle" size={20} color="#ffb59d" />
          </View>

          <View style={[styles.logItem, { borderLeftColor: '#eebd97' }]}>
            <View style={[styles.logIconWrapper, { backgroundColor: '#331902' }]}>
              <MaterialIcons name="notifications-active" size={14} color="#eebd97" />
            </View>
            <View style={styles.logContent}>
              <Text style={styles.logItemTitle}>Gentle Vibrations</Text>
              <Text style={styles.logItemTime}>5 minutes ago</Text>
            </View>
            <MaterialIcons name="check-circle" size={20} color="#eebd97" />
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity activeOpacity={0.9} style={styles.primaryBtn} onPress={() => {
            simulateBypassPush();
            Alert.alert("Nudge Dispatched", "Another high-priority ping has been sent.");
          }}>
            <LinearGradient colors={['#ffb59d', '#e65924']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.primaryBtnGradient}>
              <MaterialIcons name="bolt" size={24} color="#390c00" style={{marginRight: 8}} />
              <Text style={styles.primaryBtnText}>Send Nudge</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryBtnGrid}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleViewResponse}>
              <MaterialIcons name="visibility" size={16} color="#e1e0ff" style={{marginRight: 8}} />
              <Text style={styles.secondaryBtnText}>View Response</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dangerBtn} onPress={handleCancel}>
              <MaterialIcons name="close" size={16} color="#ffb4ab" style={{marginRight: 8}} />
              <Text style={styles.dangerBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomNav}>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavClick('Alarms')}>
            <MaterialIcons name="alarm" size={24} color="#42436b" />
            <Text style={styles.navText}>Alarms</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => router.navigate('/')}>
            <MaterialIcons name="group" size={24} color="#42436b" />
            <Text style={styles.navText}>Friends</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navCenterItem} activeOpacity={0.8} onPress={() => Alert.alert('Nudge', 'Active nudges running.')}>
            <LinearGradient colors={['#ffb59d', '#e65924']} style={styles.navCenterInner}>
              <MaterialIcons name="wb-sunny" size={24} color="#390c00" />
            </LinearGradient>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => handleNavClick('Profile')}>
            <MaterialIcons name="person" size={24} color="#42436b" />
            <Text style={styles.navText}>Profile</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e35' },
  appBar: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 14, 53, 0.7)',
    zIndex: 10,
  },
  appBarLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', backgroundColor: '#25264c', borderWidth: 1, borderColor: 'rgba(71,70,78,0.2)' },
  appBarTitle: { fontSize: 24, fontWeight: '900', color: '#ffb59d', letterSpacing: -0.5 },
  appBarRight: { padding: 4 },
  appBarBorder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1 },
  scrollContent: { padding: 24, paddingBottom: 140 },

  heroSection: { alignItems: 'center', marginBottom: 40 },
  pulsingAvatarWrapper: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  pulseOuter: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: 'rgba(255, 181, 157, 0.1)' },
  pulseInner: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 181, 157, 0.2)' },
  avatarImageContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#ffb59d', overflow: 'hidden', padding: 4, backgroundColor: '#0e0e35' },
  heroGreeting: { fontSize: 32, fontWeight: 'bold', color: '#ffb59d', textShadowColor: 'rgba(255, 181, 157, 0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20, marginBottom: 8 },
  heroSubText: { color: '#c8c5cf', fontSize: 12, fontWeight: '500', tracking: 1, letterSpacing: 1, marginBottom: 30 },
  
  timerCard: { width: '100%', backgroundColor: '#16173d', borderRadius: 24, padding: 32, alignItems: 'center', overflow: 'hidden', position: 'relative' },
  timerGlow: { position: 'absolute', top: -40, right: -40, width: 100, height: 100, backgroundColor: 'rgba(255, 181, 157, 0.1)', borderRadius: 50 },
  timerLabel: { color: '#c8c5cf', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  timerValue: { fontSize: 64, fontWeight: '900', color: '#ffb59d', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  progressIndicators: { flexDirection: 'row', gap: 4, marginTop: 16 },
  progressDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: '#34355d' },

  logSection: { marginBottom: 40 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingHorizontal: 8 },
  logTitle: { fontSize: 20, fontWeight: 'bold', color: '#e1e0ff' },
  logLiveBadge: { fontSize: 10, fontWeight: 'bold', color: '#eebd97', textTransform: 'uppercase', letterSpacing: 2 },
  logItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1b41', padding: 16, borderRadius: 12, borderLeftWidth: 4, marginBottom: 12 },
  logIconWrapper: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  logContent: { flex: 1 },
  logItemTitle: { fontSize: 14, fontWeight: 'bold', color: '#e1e0ff' },
  logItemTime: { fontSize: 12, color: '#c8c5cf', marginTop: 2 },

  actionSection: { flexDirection: 'column', gap: 16 },
  primaryBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', shadowColor: '#e65924', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  primaryBtnGradient: { paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#390c00', fontSize: 18, fontWeight: 'bold' },
  secondaryBtnGrid: { flexDirection: 'row', gap: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 16, backgroundColor: '#25264c', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: '#e1e0ff', fontWeight: 'bold', fontSize: 14 },
  dangerBtn: { flex: 1, paddingVertical: 16, backgroundColor: '#16173d', borderWidth: 1, borderColor: 'rgba(255, 180, 171, 0.2)', borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  dangerBtnText: { color: '#ffb4ab', fontWeight: 'bold', fontSize: 14 },

  bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 96, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: 24, paddingHorizontal: 16, backgroundColor: 'rgba(26, 27, 65, 0.8)', borderTopLeftRadius: 48, borderTopRightRadius: 48 },
  navItem: { alignItems: 'center', padding: 8 },
  navText: { color: '#42436b', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginTop: 4, letterSpacing: 1 },
  navCenterItem: { marginBottom: 4, shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  navCenterInner: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }
});
