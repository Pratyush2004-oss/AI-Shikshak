import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';

export default function ChapterCard({ chapter, index, docId, completed }) {
    const router = useRouter();
    const [completedChapter, setcompletedChapter] = useState([])
    useEffect(() => {
        if (completed) {
            setcompletedChapter(JSON.parse(completed))
        }
    }, [completed])
    const isChapterCompleted = (index) => {
        const isCompleted = completedChapter.find(item => item == index);
        return isCompleted ? true : false;
    }
    return (
        <TouchableOpacity onPress={() => {
            router.replace({
                pathname: '/chapterView',
                params: {
                    chapterParams: JSON.stringify(chapter),
                    docId: docId,
                    chapterIndex: index,
                    chapterName: chapter.chapterName
                }
            })
        }} style={styles.container}>
            <Text style={styles.title}>{index}.</Text>
            <Text style={styles.title} numberOfLines={1}>{chapter.chapterName}</Text>

            <TouchableOpacity style={styles.btn} onPress={() => router.replace({
                pathname: '/chapterView',
                params: {
                    chapterParams: JSON.stringify(chapter),
                    docId: docId,
                    chapterIndex: index,
                    chapterName: chapter.chapterName
                }
            })}>
                {
                    isChapterCompleted(index) ? (
                        <Ionicons name='checkmark-circle-outline' size={20} color={Colors.GREEN} />
                    ) : (
                        <Ionicons name='play' size={20} color={Colors.PRIMARY} />
                    )
                }
            </TouchableOpacity>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: Colors.BLACK,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 14,
        fontFamily: "outfit-bold",
        color: Colors.BLACK,
        marginRight: 10,
        flexWrap: 'wrap',
        maxWidth: '80%'
    },
    btn: {
        borderRadius: 10,
        marginLeft: 'auto'
    }
})