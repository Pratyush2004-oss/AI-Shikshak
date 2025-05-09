import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { imageAssets } from '../../constant/Option'
import { Colors } from '../../constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
export default function CourseList({ courseList, category, first, enroll = false }) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            {
                category && (
                    <Text style={[styles.title, {
                        fontSize: category == "Tech and Coding" ? 25 : 20,
                        marginBottom:10,
                        color: category == "Tech and Coding" ? Colors.WHITE : Colors.BLACK
                    }]}>{category}</Text>
                )
            }
            <FlatList
                style={styles.courseContainer}
                data={courseList}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => router.push({
                        pathname: `/courseView/${item.docId}`,
                        params: {
                            courseParams: JSON.stringify(item),
                            enroll
                        }
                    })} key={index} style={styles.itemContainer}>
                        <Image source={imageAssets[item.banner_image]} style={styles.image} />
                        <Text numberOfLines={2} style={styles.courseTitle}>{item.courseTitle}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Ionicons name="book-outline" size={17} color="black" />
                            <Text style={{ fontFamily: 'outfit' }}>
                                {item.chapters.length} Chapters</Text>
                        </View>
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
    courseContainer: {
        gap: 10,
    },
    itemContainer: {
        gap: 5,
        padding: 10,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 15,
        marginRight: 10,
        width: 260,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginTop: 10
    },
    courseTitle: {
        fontSize: 18,
        fontFamily: "outfit-bold",
    }
})