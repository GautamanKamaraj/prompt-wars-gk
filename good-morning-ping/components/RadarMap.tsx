import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Platform, Alert } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Dark Mode map style matching Solaris aesthetics
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0e0e35" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#16173d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#918f99" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1b41" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#08082f" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#25264c" }] },
];

const FRIENDS_GEO_MOCK = [
  {
    id: '1',
    name: 'Elena Vance',
    status: 'Sleeping',
    latitude: 37.785834 + 0.002, // slightly offset from user
    longitude: -122.406417 + 0.002,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKPfyKdyMRDI8iy5ZSCyFvLBPZ_AJ9GODYtGxRkc_9h_fAdKzfD_teyg9xFLCZSHzWCs1oDJqulO-bqpudSlwUguSluP7ujUBTjvSfmTiyM8OkgRLaVaj0bpRZd30st-k5QmjWu2jT3UUCsoHMYivkQS4xlPNXQgwcQjc1IpCNr75TnNOAtzKhV5e_pf8ONA6GdzIRVjek-YpgPguyUAUqIqeYnZMTwFNEpCj4vJcO19tWgfBMmo_YtY7yWLAvrL8erBaF3Jyl9qO4',
    color: '#eebd97', // tertiary
    accuracy: 120, // meters
  },
  {
    id: '3',
    name: 'Sarah J.',
    status: 'Snoozing',
    latitude: 37.785834 - 0.005,
    longitude: -122.406417 - 0.005,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEhtrC9UogVB4NfevEX-VmUrSJ6YdJ3sshHQv_0ErI2Z74GZXTIg0e6kA7viPTCmNJk4x7IxNodPGbfHnqjaPHqi4kqv4yo6B79wq09BBpINS4rVD593CJIB5owpTNNqS-1TDnd9kGuRkbjFBaGgihhXRdwks-lNuu1APl6RlZM9Shn7TGaNskHgEOiYrUwrJUV4XzvXQ72SURdTmJXtr-IVVvg8s5Zp3yMTxizFrhOg4bt3q5VwYxsJOsbZO8JVy4Xbk-qZYIKn4a',
    color: '#c2c2f2', // secondary
    accuracy: 300,
  }
];

export default function RadarScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<typeof FRIENDS_GEO_MOCK[0] | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required to calculate distances to your sleeping squad.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleNudgeFriend = () => {
    if (!selectedFriend) return;
    router.push({
      pathname: '/set-wakeup',
      params: { name: selectedFriend.name, avatar: selectedFriend.avatar }
    });
  };

  const initialRegion = {
    latitude: 37.785834,
    longitude: -122.406417,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {FRIENDS_GEO_MOCK.map((friend) => (
          <React.Fragment key={friend.id}>
            <Circle
              center={{ latitude: friend.latitude, longitude: friend.longitude }}
              radius={friend.accuracy}
              fillColor="rgba(255, 181, 157, 0.15)"
              strokeColor="rgba(255, 181, 157, 0.4)"
              strokeWidth={1}
            />
            <Marker
              coordinate={{ latitude: friend.latitude, longitude: friend.longitude }}
              onPress={() => setSelectedFriend(friend)}
            >
              <View style={styles.markerContainer}>
                <View style={[styles.markerStatusDot, { backgroundColor: friend.color }]} />
                <Image source={{ uri: friend.avatar }} style={styles.markerAvatar} />
              </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solaris Radar</Text>
        <Text style={styles.headerSubtitle}>Live Squad Tracking</Text>
      </View>

      {/* Selected Friend Overlay */}
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
             <Text style={styles.overlayWarning}>Unknown Location - High Risk of Missing Event</Text>
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
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  header: {
    position: 'absolute', top: Platform.OS === 'android' ? 40 : 60, left: 24, right: 24,
    backgroundColor: 'rgba(22, 23, 61, 0.8)', padding: 16, borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#ffb59d', letterSpacing: 1 },
  headerSubtitle: { fontSize: 12, color: '#c8c5cf', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4 },
  
  markerContainer: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  markerAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: '#25264c' },
  markerStatusDot: { position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: 7, zIndex: 10, borderWidth: 2, borderColor: '#0e0e35' },

  overlayCard: {
    position: 'absolute', bottom: 120, left: 24, right: 24,
    backgroundColor: 'rgba(26, 27, 65, 0.95)', borderRadius: 24, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255, 181, 157, 0.2)',
    shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 30
  },
  overlayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  overlayAvatar: { width: 40, height: 40, borderRadius: 12, marginRight: 12 },
  overlayName: { fontSize: 18, fontWeight: 'bold', color: '#e1e0ff' },
  overlayStatus: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  overlayDetails: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(238, 189, 151, 0.1)', padding: 12, borderRadius: 12, marginBottom: 20 },
  overlayWarning: { color: '#eebd97', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  
  nudgeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 20 },
  nudgeBtnText: { color: '#390c00', fontWeight: '900', fontSize: 14, marginLeft: 8, letterSpacing: 1 },

  bottomNav: {
    position: 'absolute', bottom: 0, width: '100%', height: 96,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#1a1b41', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 20
  },
  navItem: { alignItems: 'center', padding: 8 },
  navText: { color: '#42436b', fontSize: 10, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
  navCenterInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: -20, shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }
});
