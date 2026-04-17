import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Image, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import SolarisAIModal from '../components/SolarisAIModal';

export default function SetWakeUpConfig() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const friendName = searchParams.name || 'Elena Vance';
  const friendAvatar = searchParams.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1fDe5ooZGyN2pVlw2iwKtRv9Rbmc3TvyWLJPamSOC0EN3QeuX6xsFn24PHuhPpKkQYcHzUW-Xu5hwjVVGtBPFs4ThoSiDDjS_bCUW5ldpq0vzPOlLtqhpShuRGsCWUZgzdeWXNF-XNWn4gMFQ1TFsYvk7bsvcOArj0Ni_Aiii3ghCuKIlDrRh4pJjjODifHkH0QeBUkhj4ib6dzkbGqvS4P9jcWrZwLXVFjDkKbI7Tx0qlEeGaF5Q8NvgsHTxF99lHI7BQy0-sMMu';

  const [amPm, setAmPm] = useState('AM');
  const [method, setMethod] = useState('Alarm');
  const [sound, setSound] = useState('Gentle Bells');
  const [duration, setDuration] = useState(10);
  const [note, setNote] = useState('');
  const [isAIModalVisible, setAIModalVisible] = useState(false);

  const handleSchedule = () => {
    router.push({
      pathname: '/nudge-log',
      params: { name: friendName, avatar: friendAvatar }
    });
  };

  const setDurationAndAlert = (val: number) => {
    setDuration(val);
  };

  const handleTimeClick = () => {
    Alert.alert("Time Picker", "In a native app, this would open the bottom-sheet time selector!");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#e1e0ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Wake-Up</Text>
        <TouchableOpacity style={styles.headerAvatarContainer} onPress={() => Alert.alert('Profile', 'Opening Profile settings')}>
           <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUMLOUlR1_3FeHqwraa8BncX-xch-r0SkVUfLm4Hicgmkf2jab5NxQwUwmxUzdVnaHUsdQH90hFp13C7b3zFGa3fDtsAHIBztnkTcq93J2jyhucduEl9bphk9nPo3BZe7ELjnGxX3FKZ2e0Wmd_CENnIZuLB3fvsLIelza89tRFqXCAzvNaB2ogwGuDLzmgiBAhiWYRUd4LKxctzDLbdh5bSYWsocdCXQp-zIwvmtkKNQulOwyhbC6S9_6XBnNCEmDsJ9KDoKNDo62'}} style={{width:'100%', height:'100%'}} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.identitySection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarImageContainer}>
              <Image source={{ uri: friendAvatar as string }} style={styles.avatarImage} />
            </View>
            <View style={styles.statusBadge}>
              <MaterialIcons name="wb-sunny" size={12} color="#47290e" />
            </View>
          </View>
          <Text style={styles.identityName}>{friendName}</Text>
          <Text style={styles.identitySub}>Configure her morning call</Text>

          {/* New Safety Badge */}
          <View style={styles.safetyBadgeRow}>
            <MaterialIcons name="security" size={14} color="#eebd97" />
            <Text style={styles.safetyBadgeText}>Location anomaly detected. Currently at "The Airport".</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleTimeClick} activeOpacity={0.8} style={styles.timeSection}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeDigit}>07</Text>
            <Text style={styles.timeLabel}>Hours</Text>
          </View>
          <Text style={styles.timeColon}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeDigit}>45</Text>
            <Text style={styles.timeLabel}>Mins</Text>
          </View>
          <View style={styles.amPmContainer}>
            <TouchableOpacity onPress={() => setAmPm('AM')} style={[styles.amPmBtn, amPm === 'AM' && styles.amPmActive]}>
              <Text style={[styles.amPmText, amPm === 'AM' && styles.amPmTextActive]}>AM</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAmPm('PM')} style={[styles.amPmBtn, amPm === 'PM' && styles.amPmActive]}>
              <Text style={[styles.amPmText, amPm === 'PM' && styles.amPmTextActive]}>PM</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.methodTabs}>
          {['Alarm', 'Message', 'Call'].map((item) => {
            const isActive = method === item;
            const iconName = item === 'Alarm' ? 'alarm' : item === 'Message' ? 'chat-bubble' : 'call';
            return (
              <TouchableOpacity key={item} onPress={() => setMethod(item)} style={[styles.methodBtn, isActive && styles.methodBtnActive]}>
                {isActive ? (
                  <LinearGradient colors={['#ffb59d', '#e65924']} style={StyleSheet.absoluteFill} borderRadius={16} />
                ) : null}
                <MaterialIcons name={iconName} size={24} color={isActive ? '#390c00' : '#c8c5cf'} style={{ zIndex: 1, marginBottom: 8 }} />
                <Text style={[styles.methodText, isActive && styles.methodTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.optionsCard}>
          <View style={styles.optionsHeader}>
            <MaterialIcons name="music-note" size={16} color="#eebd97" />
            <Text style={styles.optionsTitle}>Select Soundscape</Text>
          </View>
          
          {['Gentle Bells', 'Morning Rooster', 'Siren Max Volume'].map(s => (
             <TouchableOpacity key={s} onPress={() => setSound(s)} style={[styles.soundRow, sound === s && styles.soundRowActive]}>
               <View style={styles.soundRowLeft}>
                 <MaterialIcons name="notifications-active" size={20} color={sound === s ? '#ffb59d' : '#918f99'} style={{marginRight: 12}} />
                 <Text style={styles.soundText}>{s}</Text>
               </View>
               <View style={[styles.radioOuter, sound === s && styles.radioOuterActive]}>
                 {sound === s && <View style={styles.radioInner} />}
               </View>
             </TouchableOpacity>
          ))}
        </View>

        {/* Faux Interactive Slider */}
        <View style={styles.durationSection}>
          <View style={styles.durationHeader}>
            <Text style={styles.durationTitle}>Nudge Duration</Text>
            <Text style={styles.durationValue}>{duration}<Text style={{fontSize: 12, fontWeight: '500'}}>min</Text></Text>
          </View>
          
          <View style={styles.sliderInteractiveArea}>
             <View style={styles.sliderTrackLine} />
             <View style={[styles.sliderTrackLine, { width: duration === 5 ? '10%' : duration === 10 ? '50%' : '90%', backgroundColor: '#ffb59d', position: 'absolute', top: 0, zIndex: 1 }]} />
             <View style={[styles.sliderThumb, { left: duration === 5 ? '10%' : duration === 10 ? '50%' : '90%' }]} />
             
             {/* Clickable hotspots for dummy slider */}
             <View style={styles.sliderHotspots}>
               <TouchableOpacity style={styles.hotspot} onPress={() => setDurationAndAlert(5)} />
               <TouchableOpacity style={styles.hotspot} onPress={() => setDurationAndAlert(10)} />
               <TouchableOpacity style={styles.hotspot} onPress={() => setDurationAndAlert(15)} />
             </View>
          </View>

          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabelText, duration === 5 && styles.sliderLabelActive]}>5m</Text>
            <Text style={[styles.sliderLabelText, duration === 10 && styles.sliderLabelActive]}>10m</Text>
            <Text style={[styles.sliderLabelText, duration === 15 && styles.sliderLabelActive]}>15m</Text>
          </View>
        </View>

        <View style={styles.noteSection}>
          <View style={styles.noteHeaderRow}>
            <Text style={styles.noteTitle}>Add a wake-up note</Text>
            <TouchableOpacity style={styles.aiTriggerBtn} onPress={() => setAIModalVisible(true)}>
               <MaterialIcons name="auto-awesome" size={14} color="#390c00" />
               <Text style={styles.aiTriggerText}>AI Assist</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noteInputContainer}>
            <MaterialIcons name="edit" size={20} color="#42436b" style={{marginRight: 12, marginTop: 4}} />
            <TextInput 
              style={styles.noteInput}
              placeholder="e.g. Rise and shine, breakfast is at 9!"
              placeholderTextColor="#42436b"
              multiline
              numberOfLines={2}
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

      </ScrollView>

      <SolarisAIModal 
        visible={isAIModalVisible} 
        friendName={friendName as string} 
        onClose={() => setAIModalVisible(false)} 
        onApply={(text) => setNote(text)}
      />

      <View style={styles.footer}>
        <LinearGradient colors={['rgba(14,14,53,0)', 'rgba(14,14,53,0.9)', '#0e0e35']} style={StyleSheet.absoluteFill} />
        <TouchableOpacity activeOpacity={0.9} onPress={handleSchedule}>
          <LinearGradient colors={['#ffb59d', '#e65924']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.scheduleButton}>
            <MaterialIcons name="schedule-send" size={24} color="#390c00" />
            <Text style={styles.scheduleText}>Schedule Wake-Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e35' },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(14,14,53,0.8)',
    zIndex: 10,
  },
  backButton: { padding: 4 },
  headerTitle: { color: '#ffb59d', fontSize: 18, fontWeight: 'bold' },
  headerAvatarContainer: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#3f0e00', overflow: 'hidden' },
  scrollContent: { padding: 24, paddingBottom: 140 },
  identitySection: { alignItems: 'center', marginBottom: 40 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarGlow: { position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, backgroundColor: 'rgba(255, 181, 157, 0.2)', borderRadius: 100 },
  avatarImageContainer: { width: 120, height: 120, borderRadius: 24, overflow: 'hidden', borderWidth: 4, borderColor: '#25264c' },
  avatarImage: { width: '100%', height: '100%' },
  statusBadge: { position: 'absolute', bottom: -8, right: -8, backgroundColor: '#eebd97', padding: 6, borderRadius: 20 },
  identityName: { color: '#e1e0ff', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  identitySub: { color: '#c8c5cf', fontSize: 16, marginBottom: 12 },
  safetyBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(238, 189, 151, 0.1)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16 },
  safetyBadgeText: { color: '#eebd97', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  timeSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  timeBlock: { alignItems: 'center' },
  timeDigit: { fontSize: 64, fontWeight: '900', color: '#ffb59d', letterSpacing: -2 },
  timeLabel: { fontSize: 10, fontWeight: 'bold', color: '#42436b', textTransform: 'uppercase', letterSpacing: 2 },
  timeColon: { fontSize: 50, color: '#303158', marginHorizontal: 16, marginBottom: 20, fontWeight: '300' },
  amPmContainer: { marginLeft: 16 },
  amPmBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  amPmActive: { backgroundColor: '#25264c' },
  amPmText: { color: '#c8c5cf', fontWeight: 'bold', fontSize: 14 },
  amPmTextActive: { color: '#ffb59d' },
  methodTabs: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  methodBtn: { flex: 1, backgroundColor: '#25264c', borderRadius: 16, padding: 16, alignItems: 'center', overflow: 'hidden' },
  methodBtnActive: { backgroundColor: 'transparent' },
  methodText: { zIndex: 1, color: '#c8c5cf', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  methodTextActive: { color: '#390c00' },
  optionsCard: { backgroundColor: 'rgba(26, 27, 65, 0.6)', borderRadius: 24, padding: 24, marginBottom: 30 },
  optionsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  optionsTitle: { color: '#eebd97', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  soundRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#16173d', borderRadius: 12, marginBottom: 8 },
  soundRowActive: {},
  soundRowLeft: { flexDirection: 'row', alignItems: 'center' },
  soundText: { color: '#e1e0ff', fontWeight: '500', fontSize: 16 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#47464e', justifyContent: 'center', alignItems: 'center' },
  radioOuterActive: { borderColor: '#ffb59d' },
  radioInner: { width: 10, height: 10, backgroundColor: '#ffb59d', borderRadius: 5 },
  durationSection: { marginBottom: 30 },
  durationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  durationTitle: { color: '#e1e0ff', fontSize: 14, fontWeight: 'bold' },
  durationValue: { color: '#ffb59d', fontSize: 24, fontWeight: '900' },
  
  sliderInteractiveArea: { position: 'relative', height: 24, justifyContent: 'center' },
  sliderTrackLine: { height: 8, backgroundColor: '#1a1b41', borderRadius: 4, width: '100%' },
  sliderThumb: { position: 'absolute', top: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#ffb59d', zIndex: 2, marginLeft: -12, shadowColor: '#ffb59d', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
  sliderHotspots: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', zIndex: 10 },
  hotspot: { flex: 1, height: '100%' },

  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 },
  sliderLabelText: { color: '#42436b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  sliderLabelActive: { color: '#ffb59d' },
  noteSection: { marginBottom: 20 },
  noteHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  noteTitle: { color: '#e1e0ff', fontSize: 14, fontWeight: 'bold' },
  aiTriggerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffb59d', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  aiTriggerText: { color: '#390c00', fontWeight: 'bold', fontSize: 10, marginLeft: 4, textTransform: 'uppercase' },
  noteInputContainer: { backgroundColor: '#16173d', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  noteInput: { flex: 1, color: '#e1e0ff', fontSize: 14, minHeight: 40 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, zIndex: 100 },
  scheduleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: 40, shadowColor: '#e65924', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 40 },
  scheduleText: { color: '#390c00', fontSize: 18, fontWeight: '900', marginLeft: 8 }
});
