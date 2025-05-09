import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '../../../constant/Colors';
import Button from '../../../components/Shared/Button';

export default function quizSummary() {
    const { quizResultParam } = useLocalSearchParams();
    const quizResult = JSON.parse(quizResultParam);
    const [correctAnswer, setcorrectAnswer] = useState(0);
    const [totalQuestions, settotalQuestions] = useState(0);
    const router = useRouter();

    useEffect(() => {
        GetResult();
    }, [quizResult])
    const GetResult = () => {
        if (quizResult !== undefined) {
            const correctAnswer_ = Object.entries(quizResult).filter(([key, value]) => value.isCorrect === true);
            const totalQuestion_ = Object.keys(quizResult).length;

            setcorrectAnswer(correctAnswer_.length);
            settotalQuestions(totalQuestion_);
        }
    }

    const getPercentageMark = () => {
        return correctAnswer / totalQuestions * 100;
    }
    return (
        <FlatList
            data={[]}
            ListHeaderComponent={
                <View>
                    <Image source={require('../../../assets/images/wave.png')} style={{ width: '100%', height: 700, position: 'absolute' }} />
                    <View style={{ padding: 35, width: "100%" }}>
                        <Text style={{
                            fontSize: 30, fontFamily: 'outfit-bold', color: Colors.WHITE, textAlign: 'center'
                        }}>Quiz Summary</Text>
                        <View style={{ alignItems: 'center', padding: 10, backgroundColor: Colors.WHITE, borderRadius: 20, marginTop: 60 }}>
                            <Image source={require('../../../assets/images/trophy.png')}
                                style={{ width: 100, height: 100, alignSelf: 'center', marginTop: -60 }}
                            />
                            {
                                getPercentageMark() > 60 ? (
                                    <Text style={{ fontSize: 20, fontFamily: 'outfit-bold', color: Colors.BLACK, textAlign: 'center' }}>Congratulations!</Text>
                                ) : (
                                    <Text style={{ fontSize: 20, fontFamily: 'outfit-bold', color: Colors.BLACK, textAlign: 'center' }}>Try Again!</Text>
                                )
                            }
                            <Text style={{ fontSize: 16, fontFamily: 'outfit-bold', color: Colors.BLACK, textAlign: 'center', marginTop: 20 }}>You scored {getPercentageMark()}% Correct Answers</Text>

                            <View style={{}}>
                                <View style={styles.resultTextContainer}>
                                    <Text style={styles.resultText}>Q: {totalQuestions}</Text>
                                    <Text style={styles.resultText}>✅: {correctAnswer}</Text>
                                    <Text style={styles.resultText}>❌: {totalQuestions - correctAnswer}</Text>
                                </View>
                            </View>

                        </View>
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Button text={'Back to Home'} onPress={() => router.replace('/(tabs)/Home')} type="fill" />
                        </View>
                        <View style={{ marginTop: 25, flex: 1 }}>
                            <Text style={{ fontSize: 20, fontFamily: 'outfit-bold', color: Colors.BLACK }}>Summary</Text>
                            <FlatList
                                data={Object.entries(quizResult)}
                                renderItem={({ item, index }) => {
                                    const quizItem = item[1];
                                    return (
                                        <View style={[styles.questionContainer, {
                                            backgroundColor: quizItem.isCorrect ? Colors.LIGHT_GREEN : Colors.LIGHT_RED,
                                            borderColor: quizItem.isCorrect ? Colors.GREEN : Colors.RED
                                        }]}>
                                            <Text style={{ fontSize: 18, fontFamily: 'outfit', color: Colors.BLACK }}> {index + 1}. {quizItem.question}</Text>
                                            <Text style={{ fontSize: 18, fontFamily: 'outfit', color: Colors.BLACK }}>Ans: {quizItem.correctAns}</Text>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </View>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    resultTextContainer: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        elevation: 5,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        marginTop: 20
    },
    resultText: {
        fontSize: 20,
        fontFamily: 'outfit',
    },
    questionContainer: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        elevation: 5,
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1
    }
})