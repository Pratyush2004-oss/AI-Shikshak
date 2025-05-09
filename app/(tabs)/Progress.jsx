import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '../../context/UserdetailContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../configs/firebaseConfig';
import ProgressCard from '../../components/Shared/ProgressCard';
import { Colors } from '../../constant/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Progress() {
  const [courseList, setcourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [sort, setsort] = useState("asc"); // Default sort order is ascending

  const GetCourseList = async () => {
    setloading(true);
    try {
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail.email),
        orderBy("createdAt", sort) // Use the sort state for ordering
      );

      const querySnapshot = await getDocs(q);

      setcourseList([]);
      querySnapshot.forEach((doc) => {
        setcourseList((prev) => [...prev, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail, sort]); // Re-fetch data when sort order changes

  return (
    <View>
      <Image
        source={require('../../assets/images/wave.png')}
        style={{ width: '100%', height: 650, position: 'absolute' }}
      />
      <View style={{ padding: 20, marginTop: 20, gap: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title}>Course Progress</Text>
          <Pressable style={{ position: 'absolute', right: 10, zIndex: 10, top: 0 }}
            onPress={() => setsort(sort === "asc" ? "desc" : "asc")} // Toggle sort order
          >
            <Ionicons
              name={sort === "asc" ? "arrow-up" : "arrow-down"} // Change icon based on sort order
              size={28}
              color={Colors.WHITE}
            />
          </Pressable>
        </View>
        <View style={{ paddingBottom: 150 }}>
          <FlatList
            refreshing={loading}
            onRefresh={() => GetCourseList()}
            data={courseList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={{ color: Colors.WHITE }}>No course found</Text>
            )}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={{ marginBottom: 20 }}
                onPress={() =>
                  router.push({
                    pathname: `/courseView/${item.docId}`,
                    params: {
                      courseParams: JSON.stringify(item),
                    },
                  })
                }
              >
                <ProgressCard item={item} width={'97%'} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
});