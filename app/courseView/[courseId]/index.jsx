import { FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Colors } from '../../../constant/Colors';
import Intro from '../../../components/courseView/Intro';
import ChapterSection from '../../../components/courseView/ChapterSection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../configs/firebaseConfig';

export default function courseView() {
    const { courseParams, courseId, enroll } = useLocalSearchParams();
    const [course, setcourse] = useState();
    useEffect(() => {
        if (!courseParams) {
            GetCourseById();
        }
        else {
            setcourse(JSON.parse(courseParams));
        }
    }, [courseId])
    const GetCourseById = async () => {
        const docRef = await getDoc(doc(db, "Courses", courseId));
        const courseData = docRef.data();
        setcourse(courseData);
    }
    return course && (
        <FlatList
            data={[]}
            ListHeaderComponent={
                <View style={styles.container}>
                    <Intro course={course} enroll={enroll} />
                    <ChapterSection course={course} />
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" && 45,
        backgroundColor: Colors.BG_GRAY,
    }
})