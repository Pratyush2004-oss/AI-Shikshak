import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as Progress from 'react-native-progress'
import { imageAssets } from '../../constant/Option'
import { Colors } from '../../constant/Colors'
export default function ProgressCard({ item, width = 275 }) {
    const getCompletedChapterLength = (course) => {
        return course?.completedChapter?.length ?? 0;
    }
    const GetCompletedChapter = (course) => {
        const completedChapter = course?.completedChapter?.length;
        const perc = completedChapter / course?.chapters?.length;
        return perc;
    }
    const getFormattedDate = (date) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }
    return (
        <View style={[styles.itemWrapper, { width: width }]}>
            <View style={styles.imageWrapper}>
                <Image source={imageAssets[item.banner_image]} style={styles.image} />
                <View style={styles.titleContainer}>
                    <Text style={styles.CourseTitle} numberOfLines={2}>{item.courseTitle}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <Ionicons name="book-outline" size={17} color={Colors.BLACK} />
                        <Text style={{ fontFamily: 'outfit' }}>
                            {item.chapters.length} Chapters</Text>
                        <Text style={{ fontFamily: 'outfit', fontSize:12, color: Colors.GREY, marginLeft:"auto" }}>{getFormattedDate(item.createdAt)}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.ProgressContainer}>
                <Progress.Bar progress={GetCompletedChapter(item)} width={width - 30} color={Colors.PRIMARY} />
                <Text style={{ fontFamily: 'outfit' }}>{ }{getCompletedChapterLength(item)} out of {item.chapters.length} Chapter Completed</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    CourseTitle: {
        fontSize: 19,
        fontFamily: "outfit-bold",
        flexWrap: 'wrap'
    },
    titleContainer: {
        flex: 1
    },
    itemWrapper: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 10
    },
    imageWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 10
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10
    },
    ProgressContainer: {
        marginBottom: 10,
        gap: 4
    }
})