import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from '@src/hooks/useRouter';
import { useLocalSearchParams } from 'expo-router';
import { Avatar, ChannelBadge, Badge, Button } from '@src/components';
import { MessageBubble, DateSeparator, ChatComposer, QuickReplies } from '@src/components/chat';
import { colors, typography, spacing, borderRadius } from '@src/theme';
import { conversationService } from '@src/services';
import { QUICK_REPLIES } from '@src/constants';
import { formatRelativeTime } from '@src/utils';
import type { Conversation, Message } from '@src/types';

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAiMode, setIsAiMode] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [convRes, msgRes] = await Promise.all([
        conversationService.getById(id!),
        conversationService.getMessages(id!),
      ]);
      if (convRes.success) {
        setConversation(convRes.data!);
        setIsAiMode(convRes.data!.handlerType === 'ai');
      }
      if (msgRes.success) setMessages(msgRes.data);
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText('');
    setIsSending(true);
    try {
      const res = await conversationService.sendMessage(id!, text);
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  const toggleHandler = async () => {
    try {
      if (isAiMode) {
        await conversationService.handoffToHuman(id!);
      } else {
        await conversationService.resumeAI(id!);
      }
      setIsAiMode(!isAiMode);
      const systemMsg: Message = {
        id: 'sys_' + Date.now(),
        conversationId: id!,
        content: isAiMode ? 'Switched to human support' : 'AI is now handling this conversation',
        type: 'system',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMsg]);
    } catch (error) {
      console.error('Failed to toggle handler:', error);
    }
  };

  if (isLoading || !conversation) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Avatar name={conversation.customerName} size="sm" />
          <View style={styles.headerText}>
            <Text style={styles.headerName} numberOfLines={1}>
              {conversation.customerName}
            </Text>
            <View style={styles.headerMeta}>
              <ChannelBadge channel={conversation.channel} size="sm" />
              <Text style={styles.headerStatus}>
                {isAiMode ? 'AI handling' : 'Human active'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <Text style={styles.moreText}>{'\u22EF'}</Text>
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Badge
            label={isAiMode ? 'AI Active' : 'Human Active'}
            variant={isAiMode ? 'info' : 'default'}
            size="sm"
          />
          {conversation.tags.length > 0 && (
            <View style={styles.tagRow}>
              {conversation.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} label={tag} variant="neutral" size="sm" />
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity onPress={toggleHandler} activeOpacity={0.7}>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isAiMode ? 'Take over' : 'Resume AI'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            {(index === 0 || new Date(item.timestamp).getDate() !== new Date(messages[index - 1].timestamp).getDate()) && (
              <DateSeparator date={new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} />
            )}
            <MessageBubble
              message={item}
              showSender={index === 0 || messages[index - 1].sender !== item.sender}
            />
          </>
        )}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatIcon}>{'\u{1F44B}'}</Text>
            <Text style={styles.emptyChatTitle}>Start the conversation</Text>
            <Text style={styles.emptyChatText}>
              AI is ready to help this customer. Send a message or use quick replies.
            </Text>
          </View>
        }
      />

      {/* Quick Replies */}
      <QuickReplies replies={QUICK_REPLIES} onSelect={handleQuickReply} />

      {/* Composer */}
      <ChatComposer
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        onAttach={() => {}}
        placeholder={isAiMode ? 'AI will respond automatically...' : 'Type your reply...'}
        disabled={isSending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerName: {
    ...typography.label,
    color: colors.text.primary,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary[200],
    backgroundColor: colors.primary[50],
  },
  toggleText: {
    ...typography.captionBold,
    color: colors.primary[700],
  },
  messageList: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['4xl'],
    paddingVertical: spacing['5xl'],
  },
  emptyChatIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyChatTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyChatText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
