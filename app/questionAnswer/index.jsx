import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constant/Colors';
import * as Progress from "react-native-progress";
export default function QuestionAnswer() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const qaList = course.qa;
    const router = useRouter();
    const [selectedQuestion, setselectedQuestion] = useState();
    const getProgress = (currentPage) => {
        const progress = currentPage / (qaList.length);
        return progress;
    }
    const onQuestionSelect = (index) => {
        if (index == selectedQuestion) {
            setselectedQuestion(null);
        }
        else {
            setselectedQuestion(index);
        }
    }
    return (
        <FlatList
            data={[]}
            ListHeaderComponent={
                <View>
                    <Image source={require('../../assets/images/wave.png')} style={styles.wave} />
                    <View style={{ width: '100%', padding: 20, height: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap:10 }}>
                            <Pressable onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={35} color={Colors.WHITE} />
                            </Pressable>
                            <Text style={{ color: Colors.WHITE, fontSize: 25, fontFamily: 'outfit-bold' }}>Question and Answers</Text>
                        </View>
                        <View style={{ marginTop: 20, gap: 10 }}>
                            <Text style={{ color: Colors.WHITE, fontSize: 20, fontFamily: 'outfit' }}>{course.courseTitle}</Text>
                        </View>

                        <FlatList
                            data={qaList}
                            renderItem={({ item, index }) => (
                                <Pressable onPress={() => onQuestionSelect(index)} style={styles.card}>
                                    <Text style={{ color: Colors.BLACK, fontSize: 18, fontFamily: 'outfit-bold' }}>{item.question}</Text>
                                    {
                                        selectedQuestion === index && (
                                            <View style={styles.ansCard}>
                                                <Text style={{ color: Colors.GREEN, fontSize: 16, fontFamily: 'outfit' }}>{item.answer}</Text>
                                            </View>
                                        )
                                    }
                                </Pressable>
                            )}
                        />
                    </View>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    wave: {
        width: '100%',
        height: 800,
        position: 'absolute'
    },
    card: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginTop: 15,
        elevation: 2
    },
    ansCard: {
        backgroundColor: Colors.WHITE,
        marginTop: 5,
        borderTopWidth: 1,
        paddingTop: 10
    }
})