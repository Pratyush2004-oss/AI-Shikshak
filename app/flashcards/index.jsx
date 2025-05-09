import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constant/Colors';
import FlipCard from 'react-native-flip-card';
import * as Progress from 'react-native-progress';
export default function FlashCard() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const flashCards = course.flashcards;
  const router = useRouter();
  const [currentPage, setcurrentPage] = useState(0);
  const width = Dimensions.get('screen').width * 0.78;

  const onScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setcurrentPage(index);
  }

  const getProgress = (currentPage) => {
    const progress = (currentPage + 1) / (flashCards.length);
    return progress;

  }
  return (
    <View>
      <Image source={require('../../assets/images/wave.png')} style={styles.wave} />
      <View style={{ width: '100%', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={35} color={Colors.WHITE} />
          </Pressable>
          <Text style={{ color: Colors.WHITE, fontSize: 25, fontFamily: 'outfit-bold' }}>Flash Cards</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <Progress.Bar progress={getProgress(currentPage)} width={Dimensions.get('screen').width * 0.85} color={Colors.LIGHT_GREEN} />
        </View>
        <FlatList
          data={flashCards}
          horizontal
          onScroll={onScroll}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View key={index} style={{ height: 500, marginTop: 50 }}>
              <FlipCard style={styles.flipCard}>
                <View style={styles.face}>
                  <Text style={{ position: 'absolute', top: 20, right: 30, color: Colors.WHITE, fontFamily: "outfit-bold", fontSize: 16 }}>{index + 1}</Text>
                  <Text style={styles.faceText}>{item.front} </Text>
                </View>
                <View style={styles.back}>
                  <Text style={styles.backTxt}>{item.back}</Text>
                </View>
              </FlipCard>
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wave: {
    width: '100%',
    height: 800,
    position: 'absolute'
  },
  flipCard: {
    height: 400,
    width: Dimensions.get('screen').width * 0.78,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: Dimensions.get('screen').width * 0.06
  },
  face: {
    height: 500,
    width: Dimensions.get("screen").width * 0.78,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    padding: 15
  },
  faceText: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    letterSpacing: 1,
    color: Colors.WHITE
  },
  back: {
    height: 500,
    width: Dimensions.get("screen").width * 0.78,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
  },
  backTxt: {
    fontSize: 20,
    fontFamily: 'outfit',
    textAlign: 'center',
    letterSpacing: 1,
  }
})