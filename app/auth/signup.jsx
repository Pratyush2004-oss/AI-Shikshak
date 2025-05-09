import { Colors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../configs/firebaseConfig";
import { UserDetailContext } from '../../context/UserdetailContext';

export default function SignUp() {
  const router = useRouter();
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const { setuserDetail } = useContext(UserDetailContext);

  const handleSignUp = async () => {
    if (!(fullName && email && password)) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.BOTTOM);
      Alert.alert("Please fill all the fields");
      return;
    }
    setloading(true);
    createUserWithEmailAndPassword(auth, email, password).then(
      async (resp) => {
        const user = resp.user;
        ToastAndroid.show("User Created Successfully", ToastAndroid.BOTTOM);
        await setDoc(doc(db, "users", email), {
          name: fullName,
          email: email,
          member: false,
          uid: user?.uid
        })
        setuserDetail({ name: fullName, email: email, member: false, uid: user?.uid });
        router.replace("/(tabs)/Home");
        setloading(false);
      }
    ).catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        ToastAndroid.show("Email already in use", ToastAndroid.BOTTOM);
        Alert.alert("Email already in use");
      }
      setloading(false);
    });
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Create New Account</Text>
      <View style={styles.textInputWrapper}>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={(value) => setfullName(value)}
          style={styles.textInput}
        />
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          value={email}
          onChangeText={(value) => setemail(value)}
          style={styles.textInput}
        />
        <View>
          <TextInput
            value={password}
            onChangeText={(value) => setpassword(value)}
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

        <TouchableOpacity disabled={loading} style={styles.btn} onPress={handleSignUp}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.WHITE} />
          ) : (
            <Text style={styles.btnTxt}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.login}>
        <Text style={styles.loginTxt}>Already have an account! </Text>
        <Pressable onPress={() => router.push("/auth/signin")}>
          <Text
            style={[
              styles.loginTxt,
              { color: Colors.PRIMARY, fontFamily: "outfit-bold" },
            ]}
          >
            Sign In here
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
