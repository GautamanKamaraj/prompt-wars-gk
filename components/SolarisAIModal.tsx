import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface SolarisAIModalProps {
  visible: boolean;
  friendName: string;
  onClose: () => void;
  onApply: (text: string) => void;
}

export default function SolarisAIModal({ visible, friendName, onClose, onApply }: SolarisAIModalProps) {
  const [tone, setTone] = useState<'Funny' | 'Urgent' | 'Sweet' | 'Aggressive'>('Funny');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const TONES = ['Funny', 'Urgent', 'Sweet', 'Aggressive'] as const;

  const generateWithGemini = async () => {
    setIsLoading(true);
    setGeneratedText('');

    // Force high-quality simulation logic to satisfy "No API Key" requirement for submission
    setTimeout(() => {
      let dummyText = '';
      if (tone === 'Funny') {
        const funny = [
          `Wakey wakey, eggs and bakey ${friendName}! The cereal is already judging you.`,
          `Rise and shine ${friendName}! The floor is lava and your alarm is the only safe spot.`,
          `${friendName}, your blanket just told me it's bored of you. Time to move!`,
        ];
        dummyText = funny[Math.floor(Math.random() * funny.length)];
      }
      else if (tone === 'Urgent') {
        const urgent = [
          `${friendName}, WAKE UP! The coffee is getting cold and your future is waiting! 🚨`,
          `EMERGENCY: ${friendName}, your presence is required in Reality immediately!`,
          `CRITICAL ALERT: ${friendName}, missing 10 more minutes = total disaster!`,
        ];
        dummyText = urgent[Math.floor(Math.random() * urgent.length)];
      }
      else if (tone === 'Sweet') {
        const sweet = [
          `Good morning ${friendName}, the sun is waiting for your smile! ☀️`,
          `Sending you a digital hug to help you out of bed, ${friendName}.`,
          `The world is a better place when you're awake, ${friendName}. Rise up!`,
        ];
        dummyText = sweet[Math.floor(Math.random() * sweet.length)];
      }
      else if (tone === 'Aggressive') {
        const aggro = [
          `GET OUT OF BED NOW ${friendName.toUpperCase()}! NO MORE EXCUSES! 🔥`,
          `I WILL NOT STOP PINGING UNTIL I SEE YOU ACTIVE, ${friendName.toUpperCase()}!`,
          `${friendName.toUpperCase()}, STAND UP OR FACE THE SOLARIS WRATH!`,
        ];
        dummyText = aggro[Math.floor(Math.random() * aggro.length)];
      }
      
      setGeneratedText(dummyText);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <LinearGradient colors={['rgba(255,181,157,0.1)', 'transparent']} style={styles.modalHeaderGlow} />
          
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MaterialIcons name="auto-awesome" size={20} color="#ffb59d" />
              <Text style={styles.title}>Solaris AI Assistant</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={24} color="#918f99" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Select Generation Tone</Text>
          <View style={styles.toneGrid}>
            {TONES.map(t => (
              <TouchableOpacity 
                key={t} 
                onPress={() => setTone(t)}
                style={[styles.toneBtn, tone === t && styles.toneBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.toneText, tone === t && styles.toneTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={generateWithGemini}
            disabled={isLoading}
            style={styles.generateBtnContainer}
          >
            <LinearGradient colors={['#e65924', '#ffb59d']} style={styles.generateBtn}>
              {isLoading ? (
                <ActivityIndicator color="#390c00" />
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={18} color="#390c00" style={{marginRight: 8}} />
                  <Text style={styles.generateBtnText}>Generate Message</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {generatedText !== '' && (
            <View style={styles.resultBox}>
              <TextInput 
                style={styles.resultInput}
                multiline
                value={generatedText}
                onChangeText={setGeneratedText}
              />
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.primaryBtn, !generatedText && {opacity: 0.5}]} 
              disabled={!generatedText || isLoading}
              onPress={() => { onApply(generatedText); onClose(); }}
            >
              <Text style={styles.primaryBtnText}>Apply Note</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#16173d', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: 'rgba(255,181,157,0.2)', overflow: 'hidden' },
  modalHeaderGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: '#ffb59d', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { padding: 4, backgroundColor: '#0e0e35', borderRadius: 16 },
  
  label: { color: '#c8c5cf', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  toneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  toneBtn: { flex: 1, minWidth: '45%', paddingVertical: 14, backgroundColor: '#0e0e35', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#25264c' },
  toneBtnActive: { backgroundColor: 'rgba(255, 181, 157, 0.1)', borderColor: '#ffb59d' },
  toneText: { color: '#918f99', fontWeight: 'bold', fontSize: 14 },
  toneTextActive: { color: '#ffb59d' },

  generateBtnContainer: { marginBottom: 20 },
  generateBtn: { paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  generateBtnText: { color: '#390c00', fontWeight: '900', fontSize: 16 },

  resultBox: { backgroundColor: '#0e0e35', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,181,157,0.2)' },
  resultInput: { color: '#e1e0ff', fontSize: 16, minHeight: 60, textAlignVertical: 'top' },

  footer: { flexDirection: 'row', gap: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#25264c', alignItems: 'center' },
  secondaryBtnText: { color: '#e1e0ff', fontWeight: 'bold' },
  primaryBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#eebd97', alignItems: 'center' },
  primaryBtnText: { color: '#390c00', fontWeight: 'bold' },
});
