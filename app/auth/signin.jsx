import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../configs/firebaseConfig";
import { UserDetailContext } from "../../context/UserdetailContext";
import { doc, getDoc } from "firebase/firestore";

export default function SignIn() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [showPassword, setshowPassword] = useState(false);
  const { setuserDetail } = useContext(UserDetailContext);

  const handleLogin = () => {
    if (!(email && password)) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.BOTTOM);
      Alert.alert("Please fill all the fields");
      return;
    }
    setloading(true);
    signInWithEmailAndPassword(auth, email, password).
      then(async (resp) => {
        const user = resp.user;
        ToastAndroid.show("User Logged In Successfully", ToastAndroid.BOTTOM);
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const result = docSnap.data();
          console.log(result)
          await setuserDetail(result);
          router.replace("/(tabs)/Home");
          setloading(false);
        }
      }).catch((error) => {
        console.log(error)
        if (error.code === "auth/invalid-credential") {
          ToastAndroid.show("Invalid Credentials", ToastAndroid.BOTTOM);
          Alert.alert("Invalid Credentials");
        }
        setloading(false);
      })
  };

  // const getUserDetail = async () => {
  // };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <View style={styles.textInputWrapper}>
        <TextInput
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setemail(text)}
          placeholder="Email"
          style={styles.textInput}
        />
        <View>
          <TextInput
            value={password}
            onChangeText={(text) => setpassword(text)}
            placeholder="password"
            style={styles.textInput}
            {...(showPassword && { secureTextEntry: true })}
          />
          <TouchableOpacity
            onPress={() => setshowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 20,
              top: 10,
            }}
          >
            {showPassword ? (
              <Ionicons name="eye-off-outline" size={24} color={Colors.BLACK} />
            ) : (
              <Ionicons name="eye-outline" size={24} color={Colors.BLACK} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {
            loading ? (
              <ActivityIndicator size="small" color={Colors.WHITE} />
            ) : (
              <Text style={styles.btnTxt}>Sign In</Text>
            )
          }
        </TouchableOpacity>
      </View>
      <View style={styles.login}>
        <Text style={styles.loginTxt}>Don't have an account! </Text>
        <Pressable onPress={() => router.push("/auth/signup")}>
          <Text
            style={[
              styles.loginTxt,
              { color: Colors.PRIMARY, fontFamily: "outfit-bold" },
            ]}
          >
            Register Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-bold",
  },
  textInputWrapper: {
    width: "100%",
    marginTop: 30,
    gap: 20,
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: "outfit",
  },
  btn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
  },
  btnTxt: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  login: {
    padding: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loginTxt: {
    fontSize: 16,
    fontFamily: "outfit",
  },
});
