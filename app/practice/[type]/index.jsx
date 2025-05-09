import { ActivityIndicator, ActivityIndicatorBase, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { PraticeOption } from '../../../constant/Option'
import { Colors } from '../../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../configs/firebaseConfig'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { UserDetailContext } from '../../../context/UserdetailContext'
import CourseListGrid from '../../../components/Practice/CourseListGrid';
export default function PracticeTypeHomeScreen() {
    const { type } = useLocalSearchParams();
    const option = PraticeOption.find(item => item.name == type);
    const router = useRouter();
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setloading] = useState(false);
    const [courseList, setcourseList] = useState([]);

    useEffect(() => {
        GetCourseList();
    }, [userDetail]);

    const GetCourseList = async () => {
        try {
            setloading(true);
            const q = query(collection(db, 'Courses'),
                where('createdBy', '==', userDetail.email), 
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            setcourseList([]);
            querySnapshot.forEach((doc) => {
                setcourseList(prev => [...prev, doc.data()]);
            });
        } catch (error) {
            console.log(error)
        }
        finally {
            setloading(false);
        }
    }
    return (
        <View style={styles.container}>
            <Image source={option.image} style={styles.image} />
            <View style={styles.imageContainer} >
                <Pressable onPress={() => router.back()} >
                    <Ionicons name='arrow-back-circle' size={30} color={Colors.WHITE} />
                </Pressable>
                <Text style={styles.title}>{option.name}</Text>
            </View>

            {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ position: 'absolute', top: '50%', left: '50%' }} />}
            <CourseListGrid courseList={courseList} option={option} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === "ios" && 45,
        flex: 1,
    },
    imageContainer: {
        position: 'absolute',
        padding: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius:15
    },
    title: {
        fontSize: 35,
        fontFamily: "outfit-bold",
        color: Colors.WHITE,
    }
})