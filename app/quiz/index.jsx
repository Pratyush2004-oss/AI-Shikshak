import { Dimensions, Image, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constant/Colors';
import * as Progress from 'react-native-progress';
import Button from '../../components/Shared/Button';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../configs/firebaseConfig'

export default function Quiz() {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const quiz = course?.quiz;
    const router = useRouter();
    const [currentPage, setcurrentPage] = useState(0);
    const [selectedOption, setselectedOption] = useState('');
    const [result, setresult] = useState([]);
    const [loading, setloading] = useState(false);

    const getProgress = (currentPage) => {
        const progress = currentPage / (quiz.length);
        return progress;
    }

    const onSelection = (selectedChoice) => {
        setresult(prev => ({
            ...prev,
            [currentPage]: {
                userChoice: selectedChoice,
                isCorrect: quiz[currentPage]?.correctAns == selectedChoice,
                question: quiz[currentPage]?.question,
                correctAns: quiz[currentPage]?.correctAns,

            }
        }))
    }

    const onQuizFinish = async () => {
        try {
            setloading(true);
            // Save the result to the database
            await updateDoc(doc(db, "Courses", course?.docId), { quizResult: result });
            ToastAndroid.show("Quiz Completed Successfully", ToastAndroid.BOTTOM);
            // Redirect user to Quiz summary
            router.replace({
                pathname: "/quiz/summary",
                params: {
                    quizResultParam: JSON.stringify(result)
                }
            })

        } catch (error) {
            console.log(error);
            ToastAndroid.show("Something went wrong", ToastAndroid.BOTTOM);
        }
        finally {
            setloading(false);
        }

    }
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/wave.png')} style={styles.wave} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={35} color={Colors.WHITE} />
                    </Pressable>
                    <Text style={{ color: Colors.WHITE, fontSize: 25, fontFamily: 'outfit-bold' }}>{currentPage + 1} of {quiz.length}</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Progress.Bar progress={getProgress(currentPage)} width={Dimensions.get('screen').width * 0.85} color={Colors.LIGHT_GREEN} />
                </View>
                <View style={styles.quizContainer}>
                    <Text style={styles.quizTitle}>{quiz[currentPage].question}</Text>
                    <View style={{ marginTop: 20 }}>
                        {
                            quiz[currentPage].options.map((item, index) => (
                                <TouchableOpacity onPress={() => {
                                    setselectedOption(item)
                                    onSelection(item)
                                }} key={index} style={[styles.optionContainer, {
                                    backgroundColor: selectedOption == item ? Colors.LIGHT_GREEN : Colors.BG_GRAY
                                }]}>
                                    <Text style={[styles.optionText]}>{item}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            </View>
            {
                selectedOption && currentPage < quiz.length - 1 && (
                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                        <Button text={'Next'} type='fill' onPress={() => {
                            setcurrentPage(currentPage + 1)
                            setselectedOption('');
                        }} />
                    </View>
                )
            }
            {
                selectedOption && currentPage == quiz.length - 1 && (
                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                        <Button text={'Finish'} type='outline' onPress={() => onQuizFinish()} loading={loading} />
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    quizTitle: {
        fontSize: 25,
        fontFamily: "outfit-bold",
        textAlign: 'center',
    },
    wave: {
        width: '100%',
        height: 800,
    },
    quizContainer: {
        padding: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginTop: 20,
        height: Dimensions.get('screen').height * 0.7,
        elevation: 5
    },
    optionContainer: {
        backgroundColor: Colors.BG_GRAY,
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        elevation: 5
    },
    optionText: {
        fontSize: 18,
        fontFamily: "outfit",
        color: Colors.BLACK
    }
})