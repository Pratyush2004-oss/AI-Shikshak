import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/Colors'
import { CourseCategory } from "../../constant/Option"
import CourseListByCategory from '../../components/Explore/CourseListByCategory'
export default function Explore() {
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: Colors.WHITE }}
      data={[]}
      ListHeaderComponent={
        <View style={styles.container}>
          <Image source={require('../../assets/images/wave.png')} style={styles.wave} />

          <Text style={styles.title}>Explore More Courses</Text>

          {
            CourseCategory.map((item, index) => (
              <View key={index} style={{ marginTop: 0 }}>
                <CourseListByCategory category={item} />
              </View>
            ))
          }
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: Colors.WHITE,
    flex: 1
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    color: Colors.WHITE
  },
  wave: {
    position: 'absolute',
    height: 500,
    width: Dimensions.get('screen').width
  },
})