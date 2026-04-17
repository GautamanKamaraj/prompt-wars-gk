import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const FRIENDS_MOCK = [
  {
    id: '1',
    name: 'Elena Vance',
    status: 'Sleeping',
    subText: 'Alarm set for 7:30 • At "The Airport" (0.5mi)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKPfyKdyMRDI8iy5ZSCyFvLBPZ_AJ9GODYtGxRkc_9h_fAdKzfD_teyg9xFLCZSHzWCs1oDJqulO-bqpudSlwUguSluP7ujUBTjvSfmTiyM8OkgRLaVaj0bpRZd30st-k5QmjWu2jT3UUCsoHMYivkQS4xlPNXQgwcQjc1IpCNr75TnNOAtzKhV5e_pf8ONA6GdzIRVjek-YpgPguyUAUqIqeYnZMTwFNEpCj4vJcO19tWgfBMmo_YtY7yWLAvrL8erBaF3Jyl9qO4',
    icon: 'nights-stay',
    color: '#eebd97', // tertiary
    selected: false,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    status: 'Active',
    subText: 'Reading "Deep Work" • At "Home" (1.2mi)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnk3fn4dEZ3vfzP7DWjX2qQ-XBpgQHiuYA7dSp1s6T_thZbxC5lCE7GqVy96ePj_DOVuH-frUjKpxTM9Ib309G6xRsZjaGK40rS8sRhAF48E_dvBaf7MDqmnDCNCAypJfX0PORj43EgU-HhKsaUGi3BVhXFBzxxdIFf0KeOjcuCuzgvLyYHgHRUcaYBEuILdk1gZkcPQtibv3bj7JB82yv0VpBEt_dZJQ8J802p5qX1m-817Wru-ICUYgPs9_ZH42F0ZY9IabyFn7',
    icon: 'wb-sunny',
    color: '#ffb59d', // primary
    selected: false,
  },
  {
    id: '3',
    name: 'Sarah J.',
    status: 'Snoozing',
    subText: '5 mins remaining',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEhtrC9UogVB4NfevEX-VmUrSJ6YdJ3sshHQv_0ErI2Z74GZXTIg0e6kA7viPTCmNJk4x7IxNodPGbfHnqjaPHqi4kqv4yo6B79wq09BBpINS4rVD593CJIB5owpTNNqS-1TDnd9kGuRkbjFBaGgihhXRdwks-lNuu1APl6RlZM9Shn7TGaNskHgEOiYrUwrJUV4XzvXQ72SURdTmJXtr-IVVvg8s5Zp3yMTxizFrhOg4bt3q5VwYxsJOsbZO8JVy4Xbk-qZYIKn4a',
    icon: 'snooze',
    color: '#c2c2f2', // secondary
    selected: false,
  },
  {
    id: '4',
    name: 'Julian Black',
    status: 'Sleeping',
    subText: 'Silent Mode',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEIhvingmFeFx0YweD8ODJfPKHP2BWHcTdX0dPn-jh5yZEYKt_I1yC3O1runYtYkY3-9ByKMNi9gqtWyDRMJEFZnzhOdbl3kdEKPHEn_vSro1lJg01UvgevqCQq4PfplB93IO38FqZKk5_5yuwYlcncuagPLts60PvKHh3xlcox8jNqDykoa3WCu3frqUi1Byluut5AnFdxKKgAYTW5FrdxU-eJvyKGxXrRszioQszB392ePGDVIIqQOgvLW5l7eKW6sQ84MjXjIPb',
    icon: 'nights-stay',
    color: '#eebd97', // tertiary
    selected: false,
  }
];

export default function FriendsStatusDashboard() {
  const router = useRouter();
  const [friends, setFriends] = useState(FRIENDS_MOCK);
  const [activeFilter, setActiveFilter] = useState('All Friends');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('critical-wake-up', {
        name: 'Critical Wake Up',
        importance: Notifications.AndroidImportance.MAX,
        bypassDnd: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  }, []);

  const toggleSelect = (id: string) => {
    setFriends(friends.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  const handleWakeSelected = () => {
    const selected = friends.filter(f => f.selected);
    if (selected.length === 0) return;
    const target = selected[0];
    router.push({
      pathname: '/set-wakeup',
      params: { name: target.name, avatar: target.avatar }
    });
  };

  const handleNavClick = (tabName: string) => {
    Alert.alert(`Navigate to ${tabName}`, `This feature will open the ${tabName} tab.`);
  };

  // Filter Logic
  const filteredFriends = friends.filter(f => {
    // Search match
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Filter match
    if (activeFilter === 'Sleeping') {
      return f.status === 'Sleeping' || f.status === 'Snoozing';
    }
    if (activeFilter === 'Active') {
      return f.status === 'Active';
    }
    return true; // All Friends
  });

  const hasSelected = friends.some(f => f.selected);

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.appBarLeft} onPress={() => router.push('/settings')}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUMLOUlR1_3FeHqwraa8BncX-xch-r0SkVUfLm4Hicgmkf2jab5NxQwUwmxUzdVnaHUsdQH90hFp13C7b3zFGa3fDtsAHIBztnkTcq93J2jyhucduEl9bphk9nPo3BZe7ELjnGxX3FKZ2e0Wmd_CENnIZuLB3fvsLIelza89tRFqXCAzvNaB2ogwGuDLzmgiBAhiWYRUd4LKxctzDLbdh5bSYWsocdCXQp-zIwvmtkKNQulOwyhbC6S9_6XBnNCEmDsJ9KDoKNDo62' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.appBarTitle}>Solaris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appBarRight} onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" size={24} color="#42436b" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerBlock}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.heroTitle}>Rise & Shine</Text>
              <View style={styles.securityBadge}>
                <MaterialIcons name="security" size={14} color="#390c00" />
                <Text style={styles.securityBadgeText}>SECURE</Text>
              </View>
            </View>

            {/* Security Operation Hub */}
            <TouchableOpacity 
              style={styles.securityHubCard} 
              activeOpacity={0.9} 
              onPress={() => router.push('/radar')}
            >
              <LinearGradient colors={['rgba(255, 181, 157, 0.15)', 'transparent']} style={styles.hubGlow} />
              <View style={styles.hubHeader}>
                 <View style={styles.hubIconWrap}>
                    <MaterialIcons name="radar" size={20} color="#ffb59d" />
                 </View>
                 <View style={styles.hubTextContainer}>
                    <Text style={styles.hubTitle}>Solaris Security Circle</Text>
                    <Text style={styles.hubSubtitle}>2 Anomalies Detected Nearby</Text>
                 </View>
                 <MaterialIcons name="chevron-right" size={24} color="#42436b" />
              </View>
              <View style={styles.anomalyPills}>
                 <View style={styles.anomalyPill}>
                    <View style={[styles.pillDot, {backgroundColor: '#eebd97'}]} />
                    <Text style={styles.pillText}>Elena: Airport</Text>
                 </View>
                 <View style={styles.anomalyPill}>
                    <View style={[styles.pillDot, {backgroundColor: '#c2c2f2'}]} />
                    <Text style={styles.pillText}>Sarah: Out of geofence</Text>
                 </View>
              </View>
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#918f99" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Find your morning crew..."
                placeholderTextColor="#918f99"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.filtersContainer}>
            {['All Friends', 'Sleeping', 'Active'].map(filter => (
              <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)}>
                {activeFilter === filter ? (
                  <LinearGradient colors={['#ffb59d', '#e65924']} style={styles.filterChipActive}>
                    <Text style={styles.filterTextActive}>{filter}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterText}>{filter}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.listContainer}>
            {filteredFriends.length === 0 ? (
              <Text style={{color: '#918f99', textAlign: 'center', marginTop: 20}}>No friends found.</Text>
            ) : null}

            {filteredFriends.map((friend) => (
              <TouchableOpacity 
                key={friend.id} 
                style={[
                  styles.card, 
                  friend.status === 'Active' && { borderLeftWidth: 4, borderLeftColor: 'rgba(255, 181, 157, 0.4)' }
                ]}
                activeOpacity={0.8}
                onPress={() => toggleSelect(friend.id)}
              >
                <View style={[styles.cardContent, { backgroundColor: 'rgba(26, 27, 65, 0.6)' }]}>
                  <View style={styles.friendAvatarWrapper}>
                    <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                    <View style={[styles.statusIconWrapper, { backgroundColor: friend.color }]}>
                      <MaterialIcons name={friend.icon} size={10} color="#0e0e35" />
                    </View>
                  </View>
                  
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: friend.status === 'Active' ? '#ffb59d' : friend.status === 'Snoozing' ? '#c2c2f2' : '#918f99' }]} />
                      <Text style={styles.friendSubtext}>{friend.subText}</Text>
                    </View>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <View style={[styles.checkbox, friend.selected && styles.checkboxChecked]}>
                      {friend.selected && <MaterialIcons name="check" size={14} color="#0e0e35" />}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {hasSelected && (
        <View style={styles.fabContainer}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleWakeSelected}>
            <LinearGradient colors={['#ffb59d', '#e65924']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.fabArea}>
              <MaterialIcons name="bolt" size={24} color="#390c00" />
              <Text style={styles.fabText}>Wake Selected</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Fully Clickable Bottom Nav */}
      <View style={styles.bottomNav}>
         <TouchableOpacity style={styles.navItem} onPress={() => router.push('/radar')}>
            <MaterialIcons name="radar" size={24} color="#42436b" />
            <Text style={styles.navText}>Security</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navCenterItem} activeOpacity={0.8} onPress={() => Alert.alert('Friends', 'You are on the friends tab')}>
            <LinearGradient colors={['#ffb59d', '#e65924']} style={styles.navCenterInner}>
              <MaterialIcons name="group" size={24} color="#390c00" />
            </LinearGradient>
         </TouchableOpacity>
         <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
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
  avatarContainer: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255, 181, 157, 0.2)', overflow: 'hidden', marginRight: 12 },
  avatar: { width: '100%', height: '100%' },
  appBarTitle: { fontSize: 24, fontWeight: '900', color: '#ffb59d', letterSpacing: -0.5 },
  appBarRight: { padding: 4 },
  scrollContent: { padding: 24, paddingBottom: 140 },
  headerBlock: { marginBottom: 30 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#e1e0ff' },
  securityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffb59d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  securityBadgeText: { color: '#390c00', fontSize: 10, fontWeight: '900', marginLeft: 4 },
  
  securityHubCard: { backgroundColor: '#16173d', borderRadius: 24, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,181,157,0.1)', overflow: 'hidden' },
  hubGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  hubHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  hubIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,181,157,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  hubTextContainer: { flex: 1 },
  hubTitle: { color: '#ffb59d', fontSize: 16, fontWeight: 'bold' },
  hubSubtitle: { color: '#918f99', fontSize: 12, marginTop: 2 },
  anomalyPills: { flexDirection: 'row', gap: 8 },
  anomalyPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0e0e35', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,181,157,0.05)' },
  pillDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  pillText: { color: '#e1e0ff', fontSize: 11, fontWeight: 'bold' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16173d', borderRadius: 16, paddingHorizontal: 16, height: 56 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, color: '#e1e0ff', fontSize: 16 },
  filtersContainer: { flexDirection: 'row', marginBottom: 24 },
  filterChipActive: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginRight: 12 },
  filterTextActive: { color: '#390c00', fontWeight: 'bold', fontSize: 14 },
  filterChip: { backgroundColor: '#25264c', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginRight: 12 },
  filterText: { color: '#c8c5cf', fontWeight: '600', fontSize: 14 },
  listContainer: { flexDirection: 'column', gap: 16 },
  card: { borderRadius: 16, overflow: 'hidden' },
  cardContent: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  friendAvatarWrapper: { position: 'relative', marginRight: 16 },
  friendAvatar: { width: 64, height: 64, borderRadius: 12 },
  statusIconWrapper: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: '#1a1b41', justifyContent: 'center', alignItems: 'center' },
  friendInfo: { flex: 1 },
  friendName: { fontSize: 18, fontWeight: 'bold', color: '#e1e0ff', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  friendSubtext: { fontSize: 14, color: '#918f99' },
  checkboxContainer: { paddingLeft: 16 },
  checkbox: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#1a1b41', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#ffb59d' },
  fabContainer: { position: 'absolute', bottom: 110, width: '100%', alignItems: 'center', zIndex: 20 },
  fabArea: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30, shadowColor: '#e65924', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20 },
  fabText: { color: '#390c00', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 90, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#1a1b41', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  navItem: { alignItems: 'center', padding: 8 },
  navText: { color: '#42436b', fontSize: 10, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
  navCenterItem: { marginTop: -20 },
  navCenterInner: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }
});
