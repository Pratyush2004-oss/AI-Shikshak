import { ActivityIndicator, Animated, Dimensions, ScrollView, StyleSheet, Text, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import * as Progress from "react-native-progress";
import { Colors } from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../configs/firebaseConfig'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import * as Speech from 'expo-speech';

export default function ChapterView() {
    const { chapterParams, docId, chapterIndex, chapterName } = useLocalSearchParams();
    const chapters = JSON.parse(chapterParams);
    const [currentPage, setcurrentPage] = useState(0);
    const [loading, setloading] = useState(false);
    const [runningAudio, setrunningAudio] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const GetProgress = (currentPage) => {
        const perc = currentPage / (chapters?.content?.length - 1);
        return perc;
    }

    const TextToSpeech = () => {
        const text = `${chapters.content[currentPage].topic} ${chapters.content[currentPage].explain}. Now here is the example  ${chapters.content[currentPage].example}`
        const options = {
            language: 'en-US',
            onDone: () => {
                // Re-enable input area after speech is done
                setrunningAudio(false);
            },
        };
        Speech.speak(text, options)
    }

    useEffect(() => {
        if (runningAudio && pathname == '/chapterView') {
            TextToSpeech();
        }
        else {
            Speech.stop();
        }
    }, [runningAudio]);
    const OnChapterComplete = async () => {
        setloading(true);
        // Save Chapter Complete 
        try {
            await updateDoc(doc(db, 'Courses', docId), {
                completedChapter: arrayUnion(chapterIndex)
            })
            ToastAndroid.show("Chapter Completed Successfully", ToastAndroid.BOTTOM);
        } catch (error) {
            console.log(error)
        }
        finally {
            setloading(false);
        }

        // Go Back
        router.replace(`/courseView/${docId}`);
    }

    return chapters && (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom:100 }} style={styles.container}>
            <Text style={styles.title}>{chapterIndex} : {chapterName}</Text>
            <Progress.Bar progress={GetProgress(currentPage)} width={Dimensions.get('screen').width * 0.85} color={Colors.PRIMARY} style={{ marginTop: 20 }} />
            <Text style={{ fontFamily: 'outfit', textAlign: 'center', marginTop: 5 }}>{currentPage + 1} out of {chapters.content.length}</Text>

            <View style={styles.chapterContainer}>
                <TouchableHighlight style={{ alignSelf: 'flex-start' }}
                    onPress={() => {
                        setrunningAudio(!runningAudio);
                    }}>
                    {
                        runningAudio ? (
                            <Ionicons name='volume-high-outline' size={30} color={Colors.PRIMARY}
                            />
                        ) : (
                            <Ionicons name='volume-mute-outline' size={30} color={Colors.PRIMARY}
                            />
                        )
                    }
                </TouchableHighlight>
                <View>
                    <Text style={styles.title}>{chapters.content[currentPage].topic}</Text>
                    <Text style={styles.explaination}>{chapters.content[currentPage].explain}</Text>
                </View>

                {
                    chapters.content[currentPage].example && (
                        <View>
                            <Text style={styles.title}>Example:</Text>
                            <Text style={styles.explaination}>{chapters.content[currentPage].example}</Text>
                        </View>
                    )
                }
                {
                    chapters.content[currentPage].code && (
                        <View>
                            <Text style={styles.title}>Code:</Text>
                            <Text style={[styles.exampleCode, { backgroundColor: Colors.BLACK, color: Colors.WHITE, padding: 10, lineHeight: 20 }]}>
                                {chapters.content[currentPage].code}</Text>
                        </View>
                    )
                }
            </View>

            <View style={styles.btnContainer}>
                {
                    currentPage > 0 ? (
                        <TouchableOpacity onPress={() => {
                            setrunningAudio(false);
                            setcurrentPage(currentPage - 1)
                        }} disabled={currentPage === 0}>
                            <Ionicons name='arrow-back-circle-outline' size={35} color={Colors.PRIMARY} />
                        </TouchableOpacity>
                    ) : (<View></View>)
                }
                <Text style={{ fontFamily: 'outfit', textAlign: 'center', marginTop: 5 }}>{currentPage + 1} out of {chapters.content.length}</Text>
                {
                    currentPage < chapters.content.length - 1 ? (
                        <TouchableOpacity onPress={() => {
                            setrunningAudio(false);
                            setcurrentPage(currentPage + 1)
                        }} disabled={currentPage === chapters.content.length - 1}>
                            <Ionicons name='arrow-forward-circle-outline' size={35} color={Colors.PRIMARY} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            setrunningAudio(false);
                            OnChapterComplete()
                        }} >
                            {
                                loading ? (
                                    <ActivityIndicator color={Colors.WHITE} />
                                ) : (
                                    <Text style={styles.btnTxt}>Finish</Text>
                                )
                            }
                        </TouchableOpacity>
                    )
                }
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_GRAY,
        padding: 20
    },
    chapterContainer: {
        flex: 1,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 10,
        marginTop: 20,
        gap: 15
    },
    title: {
        fontSize: 23,
        fontFamily: "outfit-bold",
        color: Colors.BLACK
    },
    explaination: {
        fontSize: 17,
        fontWeight: 600,
        textAlign: 'justify',
        fontFamily: "outfit",
        color: Colors.DARK_GREY,
    },
    exampleCode: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginVertical: 10,
        padding: 2,
        fontFamily: "outfit",
    },
    example: {
        fontSize: 16,
        textAlign: 'justify',
        fontFamily: "outfit",
    },
    code: {
        fontSize: 12,
        fontFamily: "outfit",
    },
    btnContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn: {
        padding: 10,
        backgroundColor: Colors.GREEN,
        borderRadius: 10,
        color: Colors.WHITE
    },
    btnTxt: {
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
    },

})