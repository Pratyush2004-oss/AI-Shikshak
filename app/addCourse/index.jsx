import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors } from '../../constant/Colors'
import Button from '../../components/Shared/Button'
import { GenerateCourseAImodel, GenerateTopicsAImodel } from '../../configs/AIModel';
import Prompt from "../../constant/Prompt";
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../configs/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { UserDetailContext } from '../../context/UserdetailContext';
import { useRouter } from 'expo-router';
export default function AddCourse() {
    const [loading, setloading] = useState(false);
    const [inputValue, setinputValue] = useState('');
    const [topics, settopics] = useState([]);
    const [selectedTopics, setselectedTopics] = useState([]);
    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const OnGenerateTopic = async () => {
        try {
            setloading(true);
            const PROMPT = inputValue + Prompt.IDEA;
            const aiResponse = await GenerateTopicsAImodel.sendMessage(PROMPT);
            const topicIdea = JSON.parse(aiResponse.response.text());
            if (topicIdea) {
                settopics(topicIdea.course_titles);
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setloading(false);
        }
        // Get topic idea from AI
    };

    const onTopicSelect = (topic) => {
        if (selectedTopics.includes(topic)) {
            setselectedTopics(selectedTopics.filter((item) => item !== topic));
        }
        else {
            setselectedTopics([...selectedTopics, topic]);
        }
    }

    const OnGenerateCourse = async () => {
        try {
            setloading(true);
            // Used to generate course using AI model
            const PROMPT = selectedTopics + Prompt.COURSE;
            const aiResp = await GenerateCourseAImodel.sendMessage(PROMPT);
            const resp = JSON.parse(aiResp.response.text());
            const courses = resp.courses;
            if (courses) {
                courses.forEach(async (course) => {
                    const docId = Date.now().toString();
                    await setDoc(doc(db, "Courses", docId), {
                        ...course,
                        docId: docId,
                        createdAt: Date.now(),
                        createdOn: new Date(),
                        createdBy: userDetail.email
                    });
                })
            }
            ToastAndroid.show("Course Generated Successfully", ToastAndroid.BOTTOM);
            router.push("/(tabs)/Home");
        } catch (error) {
            ToastAndroid.show("Something went wrong", ToastAndroid.BOTTOM);
            console.log(error)
        }
        finally {
            setloading(false);
        }
    }
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, paddingBottom:50 }}>
            <Text style={styles.title}>Create New Course!</Text>
            <Text style={styles.subTitle}>What you want to learn today?</Text>
            <Text style={styles.description}>Write what course you want to create. (Ex: Learn React Js, Digital Marketing Guide, 10th Science Chapter)</Text>

            <View style={styles.inputWrapper}>
                <TextInput value={inputValue} editable={!loading} onChangeText={(value) => setinputValue(value)} placeholder='Ex: Learn Web Development' numberOfLines={3} multiline={true} style={styles.inputText} />

                <Button text={"Create Course"} type="outline" onPress={OnGenerateTopic} loading={loading} />

                <View style={styles.topicContainer}>
                    <Text style={styles.topicHead}>Select topics which you want to add in the course</Text>

                    <View style={styles.topicWrapper}>
                        {topics.length > 0 && topics.map((topic, index) => (
                            <Pressable key={index} style={[styles.itemWrapper, { backgroundColor: selectedTopics.includes(topic) ? Colors.LIGHT_GREEN : Colors.BG_GRAY }]} onPress={onTopicSelect.bind(this, topic)}>
                                {
                                    selectedTopics.includes(topic) && <Ionicons name="checkmark-circle-outline" size={16} color={Colors.GREEN} style={styles.checkIcon} />
                                }
                                <Text style={[styles.itemTxt, { color: selectedTopics.includes(topic) ? Colors.GREEN : Colors.PRIMARY }]}>{topic}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {
                    selectedTopics.length > 0 && (
                        <Button text={"Generate Course"} type="fill" onPress={OnGenerateCourse} loading={loading} />
                    )
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingTop: Platform.OS === "ios" && 45,
        backgroundColor: Colors.BG_GRAY,
        flex: 1,
        gap: 10,
    },
    title: {
        fontSize: 30,
        fontFamily: "outfit-bold",
        color: Colors.BLACK
    },
    subTitle: {
        fontSize: 20,
        fontFamily: "outfit",
        color: Colors.BLACK
    },
    description: {
        fontSize: 16,
        color: Colors.GRAY,
        fontFamily: "outfit",
        textAlign: "justify"
    },
    inputText: {
        borderWidth: 1,
        marginTop:10,
        padding: 10,
        borderRadius: 10,
        fontSize: 18,
        fontFamily: "outfit",
        color: Colors.BLACK,
        height: 100,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    inputWrapper: {
        gap: 20,
        width: "100%"
    },
    topicContainer: {
        marginTop: 10,
        gap: 10,
        marginBottom: 10
    },
    topicHead: {
        fontSize: 18,
        fontFamily: "outfit",
        color: Colors.BLACK
    },
    topicWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10
    },
    itemWrapper: {
        backgroundColor: Colors.BG_GRAY,
        padding: 7,
        borderRadius: 20,
        borderWidth: 0.4,
        borderColor: Colors.BLACK,
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    itemTxt: {
        fontSize: 14,
        fontFamily: "outfit",
        color: Colors.BLACK
    },
})