import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';

export default function CourseListGrid({ courseList, option }) {
    const router = useRouter();
    const OnSelected = (course) => {
        router.push({
            pathname: option.path,
            params: {
                courseParams: JSON.stringify(course)
            }
        });
    }
    return (
        <FlatList
            style={{ padding: 20,  paddingBottom:50}}
            data={courseList}
            contentContainerStyle={{ paddingBottom: 30 }}
            numColumns={2}
            renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => OnSelected(item)} key={index} style={styles.container}>
                    <Image source={option.icon} style={{ width: "100%", height: 100, objectFit: 'contain' }} />
                    <Text style={styles.title}>{item.courseTitle}</Text>
                    <Ionicons name='checkmark-circle' size={25} color={Colors.GREEN} style={styles.icon} />
                </TouchableOpacity>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        padding: 15,
        margin: 7,
        borderRadius: 15,
        elevation: 5
    },
    title: {
        fontFamily: "outfit",
        textAlign: 'center',
        marginTop: 10
    },
    icon: {
        position: 'absolute',
        top: 10,
        right: 10
    }
})