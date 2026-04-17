import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Simulated Web Map Mode using high-res static map imagery and absolutely positioned markers
const FRIENDS_GEO_MOCK = [
  {
    id: '1',
    name: 'Elena Vance',
    status: 'Sleeping',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKPfyKdyMRDI8iy5ZSCyFvLBPZ_AJ9GODYtGxRkc_9h_fAdKzfD_teyg9xFLCZSHzWCs1oDJqulO-bqpudSlwUguSluP7ujUBTjvSfmTiyM8OkgRLaVaj0bpRZd30st-k5QmjWu2jT3UUCsoHMYivkQS4xlPNXQgwcQjc1IpCNr75TnNOAtzKhV5e_pf8ONA6GdzIRVjek-YpgPguyUAUqIqeYnZMTwFNEpCj4vJcO19tWgfBMmo_YtY7yWLAvrL8erBaF3Jyl9qO4',
    color: '#eebd97', 
    reason: 'At "The Airport" (0.5mi)',
    pos: { top: '35%', left: '25%' },
    radius: 140
  },
  {
    id: '3',
    name: 'Sarah J.',
    status: 'Snoozing',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEhtrC9UogVB4NfevEX-VmUrSJ6YdJ3sshHQv_0ErI2Z74GZXTIg0e6kA7viPTCmNJk4x7IxNodPGbfHnqjaPHqi4kqv4yo6B79wq09BBpINS4rVD593CJIB5owpTNNqS-1TDnd9kGuRkbjFBaGgihhXRdwks-lNuu1APl6RlZM9Shn7TGaNskHgEOiYrUwrJUV4XzvXQ72SURdTmJXtr-IVVvg8s5Zp3yMTxizFrhOg4bt3q5VwYxsJOsbZO8JVy4Xbk-qZYIKn4a',
    color: '#c2c2f2',
    reason: 'At "Home" (12mi)',
    pos: { top: '60%', left: '70%' },
    radius: 200
  }
];

// Reusable Pulsing Marker for Web
const PulseMarker = ({ friend, onSelect }: any) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.markerAbsoluteWrap, friend.pos]}>
      {/* Accuracy Radius Glow */}
      <Animated.View style={[
        styles.pulseGlow,
        {
          width: friend.radius, height: friend.radius, borderRadius: friend.radius / 2,
          transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }],
          opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] })
        }
      ]} />
      
      <TouchableOpacity 
        style={styles.markerContainer} 
        onPress={() => onSelect(friend)}
        activeOpacity={0.9}
      >
        <View style={[styles.markerStatusDot, { backgroundColor: friend.color }]} />
        <Image source={{ uri: friend.avatar }} style={styles.markerAvatar} />
      </TouchableOpacity>
    </View>
  );
};

export default function RadarScreenWeb() {
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] = useState<typeof FRIENDS_GEO_MOCK[0] | null>(null);

  const handleNudgeFriend = () => {
    if (!selectedFriend) return;
    router.push({
      pathname: '/set-wakeup',
      params: { name: selectedFriend.name, avatar: selectedFriend.avatar }
    });
  };

  // Generate iframe element dynamically to avoid TSX React Native Intrinsic element errors
  const WebMapIframe = () => {
    if (Platform.OS !== 'web') return null;
    return React.createElement('iframe', {
      src: "https://maps.google.com/maps?q=San+Francisco&t=k&z=13&ie=UTF8&iwloc=&output=embed", // t=k means satellite
      style: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%', border: 'none' },
      allowFullScreen: true,
      loading: 'lazy'
    });
  };

  return (
    <View style={styles.container}>
      {/* Real Interactive Map for Web Preview */}
      <WebMapIframe />
      
      {/* Deep blue overlay to force "Solaris" palette on the map */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(14, 14, 53, 0.4)', pointerEvents: 'none' }]} />

      {/* Render Visual Pins */}
      {FRIENDS_GEO_MOCK.map((friend) => (
        <PulseMarker key={friend.id} friend={friend} onSelect={setSelectedFriend} />
      ))}

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solaris Radar</Text>
        <Text style={styles.headerSubtitle}>Location Operations (Web Simulated)</Text>
      </View>

      {/* Selected Friend Overlay (BottomSheet) */}
      {selectedFriend && (
        <View style={styles.overlayCard}>
          <View style={styles.overlayHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Image source={{ uri: selectedFriend.avatar }} style={styles.overlayAvatar} />
               <View>
                 <Text style={styles.overlayName}>{selectedFriend.name}</Text>
                 <Text style={styles.overlayStatus}>Status: <Text style={{color: selectedFriend.color}}>{selectedFriend.status}</Text></Text>
               </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedFriend(null)}>
              <MaterialIcons name="close" size={24} color="#918f99" />
            </TouchableOpacity>
          </View>

          <View style={styles.overlayDetails}>
             <MaterialIcons name="security" size={16} color="#eebd97" />
             <Text style={styles.overlayWarning}>Location Anomaly: {selectedFriend.reason}</Text>
          </View>
          
          <TouchableOpacity activeOpacity={0.9} onPress={handleNudgeFriend}>
            <LinearGradient colors={['#ffb59d', '#e65924']} style={styles.nudgeBtn}>
              <MaterialIcons name="bolt" size={20} color="#390c00" />
              <Text style={styles.nudgeBtnText}>INITIATE EMERGENCY NUDGE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
         <TouchableOpacity style={styles.navItem} onPress={() => {}}>
            <LinearGradient colors={['#ffb59d', '#e65924']} style={styles.navCenterInner}>
              <MaterialIcons name="radar" size={24} color="#390c00" />
            </LinearGradient>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => router.navigate('/')}>
            <MaterialIcons name="group" size={24} color="#42436b" />
            <Text style={styles.navText}>Friends</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Profile', 'Profile settings')}>
            <MaterialIcons name="person" size={24} color="#42436b" />
            <Text style={styles.navText}>Profile</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e35' },
  mapBackground: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  
  header: {
    position: 'absolute', top: 20, left: 24, right: 24,
    backgroundColor: 'rgba(22, 23, 61, 0.8)', padding: 16, borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#ffb59d', letterSpacing: 1 },
  headerSubtitle: { fontSize: 12, color: '#c8c5cf', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4 },

  markerAbsoluteWrap: { position: 'absolute', justifyContent: 'center', alignItems: 'center', width: 0, height: 0 },
  pulseGlow: { position: 'absolute', backgroundColor: 'rgba(255, 181, 157, 0.2)', borderWidth: 1, borderColor: '#ffb59d' },
  markerContainer: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.5, shadowRadius: 10 },
  markerAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#25264c' },
  markerStatusDot: { position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: 9, zIndex: 20, borderWidth: 3, borderColor: '#0e0e35' },

  overlayCard: {
    position: 'absolute', bottom: 120, left: 24, right: 24, zIndex: 100,
    backgroundColor: 'rgba(26, 27, 65, 0.95)', borderRadius: 24, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255, 181, 157, 0.3)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.8, shadowRadius: 40
  },
  overlayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  overlayAvatar: { width: 48, height: 48, borderRadius: 16, marginRight: 12 },
  overlayName: { fontSize: 20, fontWeight: 'bold', color: '#e1e0ff' },
  overlayStatus: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  overlayDetails: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(238, 189, 151, 0.1)', padding: 12, borderRadius: 12, marginBottom: 20 },
  overlayWarning: { color: '#eebd97', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  
  nudgeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, shadowColor: '#e65924', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20 },
  nudgeBtnText: { color: '#390c00', fontWeight: '900', fontSize: 14, marginLeft: 8, letterSpacing: 1 },

  bottomNav: {
    position: 'absolute', bottom: 0, width: '100%', height: 96,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#1a1b41', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 20, zIndex: 200
  },
  navItem: { alignItems: 'center', padding: 8 },
  navText: { color: '#42436b', fontSize: 10, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
  navCenterInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: -20, shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }
});
