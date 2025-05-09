import { StyleSheet, View, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant/Colors';

export default function TabLayout() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{
                headerShown: false,
                headerTitleStyle: {
                    fontWeight: "600"
                },
                headerTitleStyle: {
                    color: Colors.PRIMARY,
                    fontWeight: "600"
                },
                tabBarActiveTintColor: Colors.PRIMARY,
                headerShadowVisible: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    padding: 15,
                    paddingBottom: insets.bottom,
                    height: 60 + insets.bottom
                }
            }}>
                <Tabs.Screen
                    name="Home"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" color={color} size={size} />
                        ),
                        tabBarLabel: "Home",
                    }}
                />
                <Tabs.Screen
                    name="Explore"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="search-outline" color={color} size={size} />
                        ),
                        tabBarLabel: "Explore",
                    }}
                />
                <Tabs.Screen
                    name="Progress"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="analytics-outline" color={color} size={size} />
                        ),
                        tabBarLabel: "Progress",
                    }}
                />
                <Tabs.Screen
                    name="Profile"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-circle-outline" color={color} size={size} />
                        ),
                        tabBarLabel: "Profile",
                    }}
                />
            </Tabs>

            {/* Icon with absolute positioning */}
            <TouchableOpacity
                style={styles.floatingIcon}
                onPress={() => router.push("/chatbot")}
            >
                <Image
                    source={require('../../assets/images/robot.jpg')} // Update the path to your image
                    style={styles.iconImage}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    floatingIcon: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        zIndex: 10,
    },
    iconImage: {
        width: 60, // Set the width of the image
        height: 60, // Set the height of the image
        borderRadius: 30, // Optional: Make the image circular
    },
})