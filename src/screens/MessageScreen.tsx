import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Draft = {id: string; text: string; createdAt: string};
type Conversation = {id: string; name: string; vehicle: string; drafts: Draft[]};
const STORAGE_KEY = 'vehicle-message-drafts';

const isConversation = (value: unknown): value is Conversation => {
  if (!value || typeof value !== 'object') {return false;}
  const item = value as Conversation;
  return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.vehicle === 'string' && Array.isArray(item.drafts) && item.drafts.every(draft => draft && typeof draft.id === 'string' && typeof draft.text === 'string' && typeof draft.createdAt === 'string' && Number.isFinite(Date.parse(draft.createdAt)));
};

const MessageScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const active = conversations.find(item => item.id === activeId);
  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const data: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data) || !data.every(isConversation)) {throw new Error('Invalid conversations');}
      setConversations(data);
    } catch {setLoadError(true);} finally {setLoading(false);}
  };
  useEffect(() => {load();}, []);
  const persist = async (next: Conversation[]) => {
    if (busy.current) {return false;}
    busy.current = true;
    setSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setConversations(next);
      return true;
    } catch {Alert.alert('Could not save', 'Your draft was not saved. Please try again.'); return false;}
    finally {busy.current = false; setSaving(false);}
  };
  const createConversation = async () => {
    if (!name.trim() || !vehicle.trim()) {setError('Enter a contact name and vehicle name.'); return;}
    const item: Conversation = {id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: name.trim(), vehicle: vehicle.trim(), drafts: []};
    if (await persist([item, ...conversations])) {setCreating(false); setActiveId(item.id); setMessage('');}
  };
  const saveDraft = async () => {
    if (!active || !message.trim()) {return;}
    const draft: Draft = {id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, text: message.trim(), createdAt: new Date().toISOString()};
    const updated = {...active, drafts: [...active.drafts, draft]};
    if (await persist([updated, ...conversations.filter(item => item.id !== active.id)])) {setMessage('');}
  };
  const closeChat = () => {
    if (saving) {return;}
    if (message.trim()) {
      Alert.alert('Discard unsaved text?', 'This text has not been saved as a draft.', [{text: 'Keep Editing', style: 'cancel'}, {text: 'Discard', style: 'destructive', onPress: () => {setMessage(''); setActiveId(null);}}]);
    } else {setActiveId(null);}
  };
  const openNew = () => {setName(''); setVehicle(''); setError(''); setCreating(true);};
  const filtered = conversations.filter(item => `${item.name} ${item.vehicle}`.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}><View style={styles.flex}><Text style={styles.heading}>Messages</Text><Text style={styles.subtitle}>Your vehicle conversations</Text></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="New conversation" disabled={loading || loadError || saving} style={[styles.newButton, (loading || loadError || saving) && styles.disabled]} onPress={openNew}><Text style={styles.buttonText}>+ New</Text></TouchableOpacity></View>
      <View style={styles.searchWrap}><TextInput accessibilityLabel="Search conversations" style={styles.search} placeholder="Search by contact or vehicle" placeholderTextColor="#94a3b8" value={search} onChangeText={setSearch} /></View>
      <View style={styles.notice}><Text style={styles.noticeText}>Drafts only • Messaging is not connected yet. Nothing is sent to a contact.</Text></View>
      {loading ? <ActivityIndicator style={styles.flex} color="#ef4444" size="large" /> : loadError ? <View style={styles.empty}><Text style={styles.emptyTitle}>Could not load conversations</Text><TouchableOpacity style={styles.button} onPress={load}><Text style={styles.buttonText}>Try Again</Text></TouchableOpacity></View> : <FlatList data={filtered} keyExtractor={item => item.id} contentContainerStyle={styles.list} renderItem={({item}) => {
        const last = item.drafts[item.drafts.length - 1];
        return <TouchableOpacity accessibilityRole="button" style={styles.conversation} onPress={() => {setActiveId(item.id); setMessage('');}}><View style={styles.avatar}><Text style={styles.initial}>{item.name.charAt(0).toUpperCase()}</Text></View><View style={styles.flex}><View style={styles.titleRow}><Text numberOfLines={1} style={styles.name}>{item.name}</Text><Text style={styles.badge}>Draft</Text></View><Text numberOfLines={1} style={styles.vehicle}>{item.vehicle}</Text><Text numberOfLines={1} style={styles.preview}>{last?.text || 'No drafts yet'}</Text>{last && <Text style={styles.time}>{new Date(last.createdAt).toLocaleDateString()}</Text>}</View><Text style={styles.chevron}>›</Text></TouchableOpacity>;
      }} ListEmptyComponent={<View style={styles.empty}><View style={styles.emptyIcon}><Text style={styles.initial}>···</Text></View><Text style={styles.emptyTitle}>{search.trim() ? 'No conversations found' : 'No conversations yet'}</Text><Text style={styles.emptyText}>{search.trim() ? 'Try a different contact or vehicle name.' : 'Start a conversation draft for a vehicle you are interested in.'}</Text>{!search.trim() && <TouchableOpacity style={styles.button} onPress={openNew}><Text style={styles.buttonText}>+ New Conversation</Text></TouchableOpacity>}</View>} />}
      <Modal visible={creating} animationType="slide" onRequestClose={() => {if (!saving) {setCreating(false);}}}>
        <SafeAreaView style={styles.container}><View style={styles.header}><Text style={[styles.heading, styles.flex]}>New Conversation</Text><TouchableOpacity accessibilityRole="button" disabled={saving} style={styles.textButton} onPress={() => setCreating(false)}><Text style={styles.link}>Cancel</Text></TouchableOpacity></View><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled"><Text style={styles.emptyText}>Create a local draft. The contact will not be notified.</Text><Text style={styles.label}>Contact name</Text><TextInput accessibilityLabel="Contact name" style={styles.input} value={name} onChangeText={setName} placeholder="Contact name" placeholderTextColor="#94a3b8" maxLength={80} editable={!saving} /><Text style={styles.label}>Vehicle</Text><TextInput accessibilityLabel="Vehicle" style={styles.input} value={vehicle} onChangeText={setVehicle} placeholder="e.g. Honda City" placeholderTextColor="#94a3b8" maxLength={100} editable={!saving} />{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}<TouchableOpacity accessibilityRole="button" disabled={saving} style={[styles.button, saving && styles.disabled]} onPress={createConversation}><Text style={styles.buttonText}>{saving ? 'Saving…' : 'Create Draft Conversation'}</Text></TouchableOpacity></ScrollView></KeyboardAvoidingView></SafeAreaView>
      </Modal>
      <Modal visible={!!active} animationType="slide" onRequestClose={closeChat}>
        <SafeAreaView style={styles.container}><View style={styles.header}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Back to messages" disabled={saving} style={styles.textButton} onPress={closeChat}><Text style={styles.link}>‹ Back</Text></TouchableOpacity><View style={styles.flex}><Text numberOfLines={1} style={styles.name}>{active?.name}</Text><Text numberOfLines={1} style={styles.vehicle}>{active?.vehicle}</Text></View></View><View style={styles.notice}><Text style={styles.noticeText}>Only you can see these drafts. They have not been sent.</Text></View><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList inverted data={active ? [...active.drafts].reverse() : []} keyExtractor={item => item.id} contentContainerStyle={styles.chatList} keyboardShouldPersistTaps="handled" renderItem={({item}) => <View style={styles.bubble}><Text style={styles.message}>{item.text}</Text><Text style={styles.draftTime}>Draft · Not sent · {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text></View>} />
          {!active?.drafts.length && <Text style={styles.chatHint}>Write your first enquiry below.</Text>}
          <View style={styles.composer}><TextInput accessibilityLabel="Message draft" style={styles.messageInput} placeholder="Write a message…" placeholderTextColor="#94a3b8" value={message} onChangeText={setMessage} multiline maxLength={2000} editable={!saving} /><TouchableOpacity accessibilityRole="button" disabled={!message.trim() || saving} style={[styles.saveButton, (!message.trim() || saving) && styles.disabled]} onPress={saveDraft}><Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save Draft'}</Text></TouchableOpacity></View>
        </KeyboardAvoidingView></SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  flex: {flex: 1}, container: {flex: 1, backgroundColor: '#f5f5f5'}, header: {padding: 18, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 12}, heading: {fontSize: 23, fontWeight: '800', color: '#111827'}, subtitle: {fontSize: 13, color: '#64748b', marginTop: 5}, newButton: {backgroundColor: '#ef4444', paddingHorizontal: 16, minHeight: 44, justifyContent: 'center', borderRadius: 12}, buttonText: {fontSize: 14, color: '#fff', fontWeight: '700'}, disabled: {opacity: 0.5}, searchWrap: {padding: 16}, search: {backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, height: 48, color: '#111827'}, notice: {marginHorizontal: 16, marginBottom: 12, padding: 12, backgroundColor: '#fff1f2', borderRadius: 10}, noticeText: {fontSize: 12, lineHeight: 18, color: '#9f1239'}, list: {flexGrow: 1, paddingHorizontal: 16, paddingBottom: 24}, conversation: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#fff', borderRadius: 14, marginBottom: 10}, avatar: {width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center'}, initial: {fontSize: 24, fontWeight: '700', color: '#ef4444'}, titleRow: {flexDirection: 'row', alignItems: 'center', gap: 8}, name: {fontSize: 16, fontWeight: '700', color: '#111827', flexShrink: 1}, badge: {fontSize: 10, color: '#9f1239', backgroundColor: '#fff1f2', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5}, vehicle: {fontSize: 12, color: '#ef4444', marginTop: 4}, preview: {fontSize: 13, color: '#64748b', marginTop: 6}, time: {fontSize: 10, color: '#94a3b8', marginTop: 5}, chevron: {fontSize: 24, color: '#94a3b8'}, empty: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24}, emptyIcon: {width: 84, height: 84, backgroundColor: '#fff1f2', borderRadius: 42, alignItems: 'center', justifyContent: 'center'}, emptyTitle: {fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center'}, emptyText: {fontSize: 14, lineHeight: 22, color: '#64748b'}, button: {minHeight: 48, borderRadius: 12, backgroundColor: '#ef4444', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}, textButton: {minHeight: 44, justifyContent: 'center', paddingHorizontal: 4}, link: {fontSize: 14, fontWeight: '600', color: '#ef4444'}, form: {padding: 20, gap: 14}, label: {fontSize: 13, fontWeight: '600', color: '#334155'}, input: {minHeight: 48, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', borderRadius: 12, padding: 14, color: '#111827'}, error: {fontSize: 13, color: '#dc2626'}, chatList: {padding: 16}, bubble: {alignSelf: 'flex-end', maxWidth: '85%', padding: 14, borderRadius: 16, borderBottomRightRadius: 4, backgroundColor: '#ffe4e6', marginBottom: 12}, message: {fontSize: 15, lineHeight: 23, color: '#111827'}, draftTime: {fontSize: 10, color: '#9f1239', marginTop: 8}, chatHint: {textAlign: 'center', color: '#64748b', padding: 20}, composer: {padding: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end', gap: 10}, messageInput: {flex: 1, minHeight: 46, maxHeight: 120, backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, color: '#111827'}, saveButton: {minHeight: 46, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#ef4444', borderRadius: 12},
});
