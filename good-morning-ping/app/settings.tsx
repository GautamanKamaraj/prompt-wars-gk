import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Switch, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ExternalLink } from '@/components/external-link';

export default function SettingsScreen() {
  const [criticalEnabled, setCriticalEnabled] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const QUICK_LINKS = [
    {
      id: 'claim-credits',
      label: 'How to claim the credits',
      description: 'Walkthrough for the credit claim flow.',
      href: 'https://hack2skill.com',
    },
    {
      id: 'credits-claim',
      label: 'Credits Claim',
      description: 'Open the credits claim submission page.',
      href: 'https://hack2skill.com',
    },
    {
      id: 'make-submission',
      label: 'How to Make a Submission?',
      description: 'Submission checklist and publishing guide.',
      href: 'https://hack2skill.com',
    },
  ];

  const SETTINGS_GROUPS = [
    {
      title: 'Security Operations',
      items: [
        { id: 'critical', label: 'Critical Alert Overrides', description: 'Bypass DND for emergency nudges', type: 'switch', value: criticalEnabled, onValueChange: setCriticalEnabled, icon: 'notifications-active' },
        { id: 'radar', label: 'Proactive Radar Scan', description: 'Auto-scan friend anomalies', type: 'switch', value: true, icon: 'radar' },
      ]
    },
    {
      title: 'Global Settings',
      items: [
        { id: 'demo', label: 'Simulator Mode', description: 'Enable mock data for judges', type: 'switch', value: demoMode, onValueChange: setDemoMode, icon: 'animation' },
        { id: 'privacy', label: 'Stealth Presence', description: 'Hide your location from non-pinned friends', type: 'switch', value: false, icon: 'security' },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={['rgba(255,181,157,0.05)', 'transparent']} style={styles.headerGlow} />
      
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUMLOUlR1_3FeHqwraa8BncX-xch-r0SkVUfLm4Hicgmkf2jab5NxQwUwmxUzdVnaHUsdQH90hFp13C7b3zFGa3fDtsAHIBztnkTcq93J2jyhucduEl9bphk9nPo3BZe7ELjnGxX3FKZ2e0Wmd_CENnIZuLB3fvsLIelza89tRFqXCAzvNaB2ogwGuDLzmgiBAhiWYRUd4LKxctzDLbdh5bSYWsocdCXQp-zIwvmtkKNQulOwyhbC6S9_6XBnNCEmDsJ9KDoKNDo62' }}
            style={styles.avatar}
          />
          <View style={styles.nameSection}>
            <Text style={styles.userName}>Gautaman Kamaraj</Text>
            <Text style={styles.userRole}>Security Lead • Solaris Tier 1</Text>
          </View>
        </View>

        <View style={styles.statGrid}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>TRUST SCORE</Text>
                <Text style={[styles.statValue, {color: '#ffb59d'}]}>98%</Text>
            </View>
            <View style={[styles.statItem, {borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)'}]}>
                <Text style={styles.statLabel}>SUCCESSFUL PINGS</Text>
                <Text style={styles.statValue}>142</Text>
            </View>
        </View>
      </View>

      {/* Settings Grid */}
      {SETTINGS_GROUPS.map((group, idx) => (
        <View key={idx} style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.groupCard}>
            {group.items.map((item, i) => (
              <View key={item.id} style={[styles.settingItem, i !== group.items.length - 1 && styles.borderBottom]}>
                <View style={styles.settingIconWrap}>
                   <MaterialIcons name={item.icon as any} size={20} color="#ffb59d" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDesc}>{item.description}</Text>
                </View>
                {item.type === 'switch' && (
                  <Switch 
                    value={item.value} 
                    onValueChange={item.onValueChange} 
                    trackColor={{ false: '#25264c', true: 'rgba(255,181,157,0.4)' }}
                    thumbColor={item.value ? '#ffb59d' : '#918f99'}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.groupContainer}>
        <Text style={styles.groupTitle}>Submission Links</Text>
        <View style={styles.groupCard}>
          {QUICK_LINKS.map((item, index) => (
            <ExternalLink key={item.id} href={item.href} style={styles.linkRow}>
              <View style={[styles.settingItem, index !== QUICK_LINKS.length - 1 && styles.borderBottom]}>
                <View style={[styles.settingIconWrap, { backgroundColor: 'rgba(90, 122, 255, 0.12)' }]}>
                   <MaterialIcons name="link" size={18} color="#7aa2ff" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingDesc}>{item.description}</Text>
                </View>
                <MaterialIcons name="open-in-new" size={18} color="#918f99" />
              </View>
            </ExternalLink>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Solaris', 'Session locked successfully.')}>
        <Text style={styles.logoutText}>TERMINATE SESSION</Text>
      </TouchableOpacity>

      <Text style={styles.vCode}>SOLARIS V1.0.4-BETA • SUBMISSION BUILD</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e35' },
  content: { padding: 24, paddingBottom: 60 },
  headerGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  profileCard: { backgroundColor: '#16173d', borderRadius: 24, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,181,157,0.1)' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 20, marginRight: 16 },
  nameSection: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#e1e0ff' },
  userRole: { fontSize: 12, color: '#918f99', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  statGrid: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, color: '#918f99', fontWeight: '900', letterSpacing: 1 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#eebd97', marginTop: 4 },

  groupContainer: { marginBottom: 24 },
  groupTitle: { fontSize: 13, fontWeight: 'bold', color: '#42436b', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, paddingLeft: 4 },
  groupCard: { backgroundColor: '#16173d', borderRadius: 20, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  settingIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,181,157,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: 'bold', color: '#e1e0ff' },
  settingDesc: { fontSize: 12, color: '#918f99', marginTop: 2 },
  linkRow: { textDecorationLine: 'none' },

  logoutBtn: { marginTop: 20, paddingVertical: 18, borderRadius: 20, backgroundColor: 'rgba(230, 89, 36, 0.1)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(230, 89, 36, 0.2)' },
  logoutText: { color: '#e65924', fontWeight: 'bold', letterSpacing: 1.5 },
  vCode: { textAlign: 'center', color: '#42436b', fontSize: 10, marginTop: 40, fontWeight: '900', letterSpacing: 1 }
});
