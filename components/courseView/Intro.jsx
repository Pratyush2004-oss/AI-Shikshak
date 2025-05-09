import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { imageAssets } from '../../constant/Option'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constant/Colors'
import Button from '../Shared/Button'
import { useRouter } from 'expo-router'
import { UserDetailContext } from '../../context/UserdetailContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../configs/firebaseConfig'
export default function Intro({ course, enroll }) {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setloading] = useState(false);

  const OnEnrollCourse = async () => {
    try {
      setloading(true);
      const docId = Date.now().toString();
      const data = {
        ...course,
        docId: docId,
        createdAt: Date.now(),
        createdBy: userDetail.email,
        createdOn: new Date(),
        enrolled: true
      }
      await setDoc(doc(db, "Courses", docId), data);
      ToastAndroid.show("Course Enrolled Successfully", ToastAndroid.BOTTOM);
      router.push({
        pathname: '/courseView/' + docId,
        params: {
          courseParams: JSON.stringify(data),
          enroll: false,
        }
      });
    } catch (error) {
      ToastAndroid.show("Something went wrong", ToastAndroid.BOTTOM);
      console.log(error);
    }
    finally {
      setloading(false);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <Image source={imageAssets[course.banner_image]} style={styles.image} />
      <View style={{ padding: 15 }}>
        <Text style={styles.courseTitle}>{course.courseTitle}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="book-outline" size={17} color="black" />
          <Text style={{
            fontFamily: 'outfit', fontSize: 18
          }}>
            {course.chapters.length} Chapters</Text>
        </View>
        <Text style={[styles.description, { marginTop: 15, fontSize: 20, fontFamily: "outfit-bold", color: Colors.BLACK }]}>Description: </Text>
        <Text style={styles.description}>{course.description}</Text>

        {
          enroll == 'true' ?
            <Button text={'Enroll Now'} type='fill' onPress={() => OnEnrollCourse()} loading={loading} /> :
            <Button text={'Start Now'} type='fill' onPress={() => { }} />
        }
      </View>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  courseTitle: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    marginTop: 10
  },
  description: {
    fontFamily: "outfit",
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'justify',
    marginVertical: 5,
    color: Colors.GRAY,
  },
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    borderRadius: 50,
  }
})