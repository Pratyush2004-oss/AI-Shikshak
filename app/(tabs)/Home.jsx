import { FlatList, Image, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Home/Header'
import { Colors } from '../../constant/Colors'
import EmptyState from '../../components/Home/EmptyState'
import { db } from '../../configs/firebaseConfig'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { UserDetailContext } from '../../context/UserdetailContext'
import CourseList from '../../components/Home/CourseList'
import PracticeSection from '../../components/Home/PracticeSection'
import ProgressDetail from '../../components/Home/Progress'
export default function home() {
  const [courseList, setcourseList] = useState([]);
  const { userDetail, setuserDetail } = useContext(UserDetailContext);
  const [loading, setloading] = useState(false);

  
  const GetCourseList = async () => {
    try {
      setloading(true);
      if(!userDetail) return;
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail.email),
        orderBy("createdAt", "desc") // Sort by 'createdAt' field in descending order
      );
      const querySnapshot = await getDocs(q);
  
      setcourseList([]);
      querySnapshot.forEach((doc) => {
        setcourseList(prev => [...prev, doc.data()]);
      });      
    } catch (error) {
      console.log(error);
    }
    finally{
      setloading(false);
    }
  
  }
  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  return (
    <FlatList
      data={[]}
      onRefresh={GetCourseList}
      refreshing={loading}
      ListHeaderComponent={
        <View style={{ flex: 1, backgroundColor: Colors.BG_GRAY }}>
          <Image source={require('../../assets/images/wave.png')} style={styles.wave} />

          <View style={styles.container}>
            <Header />
            {
              courseList.length > 0 ? (
                <View>
                  <ProgressDetail courseList={courseList} />
                  <PracticeSection />
                  <CourseList courseList={courseList} />
                </View>
              ) : (
                <EmptyState />
              )
            }
          </View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === "ios" && 45,
    // flex: 1,
  },
  wave: {
    position: 'absolute',
    width: '100%',
  }
})