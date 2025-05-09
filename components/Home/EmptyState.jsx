import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '../Shared/Button'
import { Colors } from '../../constant/Colors'
import { useRouter } from 'expo-router'

export default function EmptyState() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/book.png')} style={styles.image} />
            <Text style={styles.title}>You don't have any Course</Text>

            <View style={styles.btnWrapper}>
                <Button text={'+ Create New Course'} onPress={() => router.push('/addCourse')} type="fill" />
                <Button text={'Explore Existing Course'} onPress={() => { }} type="outline" />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 300,
        height: 300
    },
    title: {
        fontSize: 25,
        fontFamily: "outfit-bold",
        textAlign: 'center',
    },
    btnWrapper: {
        marginTop: 10,
        gap: 20,
        width: '100%',
        borderTopColor: Colors.BLACK,
        borderTopWidth: 1,
        paddingTop: 20
    }

})