import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "@/configs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserdetailContext";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Index() {
  const { setuserDetail } = useContext(UserDetailContext);
  const [permissionGranted, setpermissionGranted] = useState(false);
  const [loading, setloading] = useState(true);
  const router = useRouter();

  // request notification permission
  useEffect(() => {
    const requestPermission = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.requestPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus != 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        setpermissionGranted(finalStatus === 'granted');
      }
      else {
        console.log("Not a device");
      }
    }
    requestPermission();
  }, [])

  // schedule a notification 
  const scheduleDailyNotifications = async () => {
    if (permissionGranted) {
      // Get all scheduled notifications
      const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();

      // If notifications are already scheduled, skip scheduling
      if (existingNotifications.length > 0) {
        console.log("Notifications are already scheduled.");
        return;
      }

      const notificationTimes = [
        { hour: 10, minute: 0 }, // 10:00 AM
      ];

      for (const time of notificationTimes) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'AI Sikshak',
            body: 'Transform your ideas into engaging educational content with AI! 📚🤖',
            sound: "default",
          },
          trigger: {
            hour: time.hour,
            minute: time.minute,
            repeats: true, // Ensures the notification repeats daily
          },
        });
      }
    }
  };

  // automatically send notification to the client
  useEffect(() => {
    if (permissionGranted) {
      scheduleDailyNotifications();
    }
  }, [permissionGranted]);



  onAuthStateChanged(auth, async (user) => {
    try {
      setloading(true);
      if (user) {
        const result = await getDoc(doc(db, "users", user?.email));
        // console.log(result.data())
        setuserDetail(result.data());
        router.replace("/(tabs)/Home");
      }
    } catch (error) {
      // console.log(error);
    }
    finally {
      setloading(false);
    }
  })
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/landing.png")}
        style={styles.image}
      />
      {
        loading ? (
          <View style={styles.textContainer}>
            <ActivityIndicator size="large" color={Colors.WHITE} />
            <Text style={styles.title}>Loading........</Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to AI Shikshak</Text>
            <Text style={styles.description}>
              Transform your ideas into engaging educational content, effortlessly
              with AI!! 📚🤖{" "}
            </Text>
            <View style={styles.btnWrapper}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => router.push("/auth/signup")}
              >
                <Text style={styles.btnTxt}>Get Started</Text>
                <Ionicons name="arrow-forward" size={24} color={Colors.PRIMARY} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: Colors.PRIMARY,
                    borderColor: Colors.WHITE,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => router.push("/auth/signin")}
              >
                <Text style={[styles.btnTxt, { color: Colors.WHITE }]}>
                  Already have an Account?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  image: {
    height: 275,
    width: Dimensions.get('screen').width,
    marginTop: 50,
    marginBottom:20
  },
  textContainer: {
    height: "100%",
    backgroundColor: Colors.PRIMARY,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "outfit",
    color: Colors.WHITE,
    marginTop: 20,
    lineHeight: 25,
    letterSpacing: 1.6,
  },
  btnWrapper: {
    marginTop: 30,
    gap: 20,
  },
  btn: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  btnTxt: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
});
