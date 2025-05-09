import {EXPO_OPENAPI_KEY} from '@env';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, Animated, KeyboardAvoidingView, Alert, ActivityIndicator, Pressable, Keyboard } from 'react-native'
import React, { useState, useRef, useEffect, memo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { chatbot } from '../../configs/AIModel';
import { Colors } from '../../constant/Colors';
import { usePathname, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [isSpeaking, setisSpeaking] = useState(false);
    const [input, setInput] = useState('');
    const [recording, setrecording] = useState(null);
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const [isanimated, setisanimated] = useState(false);
    const flatListRef = useRef(null);

    const path = usePathname();

    // Animated text
    const AnimatedText = memo(({ text, style }) => {
        const words = text.split(' ');
        const animations = useRef(words.map(() => new Animated.Value(0))).current;
        useEffect(() => {
            const animationsSequence = words.map((_, index) =>
                Animated.timing(animations[index], {
                    toValue: 1,
                    duration: 300,
                    delay: index * 20, // 100ms delay between words
                    useNativeDriver: true,
                })
            );
            Animated.stagger(10, animationsSequence).start();
            setTimeout(() => {
                setisanimated(false);
            }, 4000);
        }, []); // Depend only on the `text` prop

        return (
            <View style={styles.animatedContainer}>
                {words.map((word, index) => (
                    <Animated.Text
                        key={index}
                        style={[
                            style,
                            {
                                opacity: animations[index],
                                transform: [
                                    {
                                        translateY: animations[index].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [10, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {word}{' '}
                    </Animated.Text>
                ))}
            </View>
        );
    });

    useEffect(() => {
        if (path !== '/chatbot') {
            Speech.stop();
        }
    }, [path]);

    // chat with chatbot
    const handleSend = async () => {
        if (input.trim() === '') return;

        // Add the user's message to the chat
        setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now().toString(), text: input, sender: 'user' },
        ]);

        // Clear the input field
        setInput('');
        // hide the keyboard after sending message
        Keyboard.dismiss();

        // Scroll to the last message
        flatListRef.current?.scrollToEnd({ animated: true });

        try {
            const response = await chatbot.sendMessage(`Act as a tutor and explain the topic related to the topic "${input}" and without any headings only in a paragraph without line breaks in 5 to 8 lines and make it as easy to understand as possible.`);

            // Add the AI's response to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now().toString(), text: response.response.text(), sender: 'bot' },
            ]);

            // Disable input area while speaking
            setisanimated(true);

            // Scroll to the last message
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now().toString(), text: "Something went wrong", sender: 'bot' },
            ]);

            // Scroll to the last message
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    // render messages in message container
    const renderMessage = ({ item, index }) => {
        const isLastBotMessage = item.sender === "bot" && index === messages.length - 1;
        return (
            item.sender === "user" ? (
                <View
                    style={[
                        styles.message,
                        styles.userMessage,
                    ]}
                >
                    <Text style={styles.userMessageText}>{item.text}</Text>
                </View>
            ) : (
                <View
                    style={[
                        styles.message,
                        styles.botMessage,
                    ]}
                >
                    {isLastBotMessage && isanimated ? (
                        <AnimatedText
                            text={item.text}
                            style={styles.botMessageText}
                            stopAudio={() => {
                                Speech.stop();
                                setisSpeaking(false);
                            }}
                        />
                    ) : (
                        <Text style={styles.botMessageText}>{item.text}</Text>
                    )}
                </View>
            )
        );
    };

    // Empty State
    const EmptyState = () => {
        return (
            <View style={styles.emptyState}>
                <Image
                    source={require('../../assets/images/robot.png')} // Update the path to your image
                    style={styles.emptyStateImage}
                />
                <Text style={styles.emptyStateText}>Hello, How can I help you...</Text>
            </View>
        )
    }

    // voice commands
    const startRecording = async () => {
        try {
            Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setrecording(recording);
        } catch (error) {
            Alert.alert("Failed to start recording");
        }
    };

    // stop recording
    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log('Recording saved to', uri);
            setrecording(null);

            // Pass the URI to uploadAndTranscribe
            uploadAndTranscribe(uri);
        } catch (error) {
            Alert.alert("Failed to stop recording");
        }
    };

    // upload to server
    const uploadAndTranscribe = async (uri) => {
        setloading(true);
        const API_KEY = EXPO_OPENAPI_KEY;
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: 'audio.m4a',
            type: 'audio/m4a',
        });
        formData.append('model', 'whisper-1');

        try {
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    // ❌ DO NOT manually set 'Content-Type'
                },
                body: formData,
            });

            const result = await response.json();
            console.log('Transcript:', result);
            setInput(result.text);
        } catch (error) {
            console.error('Error uploading and transcribing audio:', error);
            Alert.alert("Failed to transcribe audio");
        } finally {
            setloading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    router.back();
                    Speech.stop();
                }} style={{ position: "absolute", left: 15, top: 15 }}>
                    <Ionicons name='arrow-back' size={30} color='black' />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/images/robot.png')} // Update the path to your image
                    style={styles.iconImage}
                />
                <Text style={styles.headerText}>Ela-AI</Text>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef} // Attach the ref to FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatArea}
                ListEmptyComponent={<EmptyState />}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Scroll to the end when content changes
            />

            {/* Input Area */}
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                />
                {/* Voice Button */}
                {/*
                    <View style={{ padding: 20 }}>
                    <TouchableOpacity
                        onPress={recording ? stopRecording : startRecording}
                    >{recording ?
                        <Ionicons name="stop" size={22} color={Colors.PRIMARY} />
                        : loading ? <ActivityIndicator color={Colors.PRIMARY} /> :
                            <Ionicons name="mic" size={22} color={Colors.PRIMARY} />
                        }
                        </TouchableOpacity>
                        </View>
                        */}
                <TouchableOpacity
                    style={[styles.sendButton, isSpeaking && { opacity: 0.5 }]} // Dim the button when disabled
                    onPress={handleSend}
                >
                    <Ionicons name="send" size={22} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: Colors.WHITE,
        opacity: 0.8,
        padding: 5,
        alignItems: 'center',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    chatArea: {
        flexGrow: 1,
        padding: 10,
    },
    message: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: '95%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.PRIMARY,
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.LIGHT_GRAY,
    },
    botMessageText: {
        fontFamily: "outfit",
        fontSize: 15,
        color: 'black',
        // textAlign: "justify"
    },
    userMessageText: {
        color: "white",
        fontSize: 15,
        fontFamily: "outfit",
        textAlign: "justify"
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 100
    },
    emptyStateText: {
        marginTop: 20,
        fontSize: 22,
        fontFamily: 'outfit-bold',
    },
    iconImage: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    animatedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});