import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../constant/Colors'
import ProgressCard from '../Shared/ProgressCard'
import { useRouter } from 'expo-router';
export default function ProgressDetail({ courseList }) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progress</Text>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={courseList}
                renderItem={({ item, index }) => (
                    <TouchableOpacity key={index} onPress={() => router.push({
                        pathname: `/courseView/${item.docId}`,
                        params: {
                            courseParams: JSON.stringify(item)
                        }
                    })}>
                        <ProgressCard item={item} />
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
        color: Colors.WHITE
    },

})