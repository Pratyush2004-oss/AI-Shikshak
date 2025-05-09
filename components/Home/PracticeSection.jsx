import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { PraticeOption } from '../../constant/Option'
import { Colors } from '../../constant/Colors'
import { useRouter } from 'expo-router';
export default function PracticeSection() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <FlatList
        data={PraticeOption}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => router.push({
            pathname: '/practice/' + item.name
          })} key={index} style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.courseTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
  },
  itemContainer: {
    margin: 5,
    flex: 1,
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: 150,
    borderRadius: 10,
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontFamily: "outfit",
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 5,
    color: Colors.WHITE,
  }
})