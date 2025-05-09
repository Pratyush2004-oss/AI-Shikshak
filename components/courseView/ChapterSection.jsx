import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/Colors'
import ChapterCard from './ChapterCard'
import { useRouter } from 'expo-router'

export default function ChapterSection({ course }) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chapters</Text>

            <FlatList
                data={course.chapters}
                renderItem={({ item, index }) => (
                    <ChapterCard chapter={item} index={index + 1} docId={course.docId} completed={JSON.stringify(course.completedChapter)} />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: Colors.BG_GRAY,
    },
    title: {
        fontSize: 25,
        fontFamily: "outfit-bold",
        color: Colors.BLACK
    }
})