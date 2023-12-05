import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, Alert, Modal, Pressable } from 'react-native';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { Button } from '@rneui/themed';
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const auth = FIREBASE_AUTH;

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const errorCode = error.code;
      console.error('Sign-in error:', error);
      alert("Sign in failed: " + error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (resetEmail:any) => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("อีเมลยืนยันสำหรับการเปลี่ยนรหัสผ่านถูกส่งไปที่อีเมลของคุณ");
    } catch (error: any) {
      Alert.alert('ส่งอีเมลยืนยันเพื่อเปลี่ยนรหัสผ่านผิดพลาด:', error);
      console.log("เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/sumarizelogo.png")}></Image>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button buttonStyle={{backgroundColor:'black', width:150, marginTop:10}} title="Sign In" onPress={handleSignIn} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate("Register")}>
          สมัครสมาชิก
        </Text>
        <Text style={styles.forgotPasswordText} onPress={() => setModalVisible(true)}>
          ลืมรหัสผ่าน
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(!isModalVisible)}>
          <Text style={styles.modalTitle}>กรอกอีเมลของคุณ</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Email"
            onChangeText={(text) => setResetEmail(text)}
          />
          <Pressable
            style={styles.ButtonETC}
            onPress={() => {
              // เรียกฟังก์ชันส่งอีเมลยืนยันที่คุณสร้าง
              changePassword(resetEmail);
              setModalVisible(!isModalVisible);
            }}
          ><Text style={{ color: 'white', justifyContent: 'center', fontWeight: 'bold' }}>ส่งอีเมลยืนยัน</Text></Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingLeft: 10,
  },
  forgotPasswordText: {
    fontSize: 15,
    marginTop: 50,
    color: '#687EFF',
    padding: '5%',
    textDecorationLine: 'underline'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalInput: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingLeft: 10,
  },
  ButtonETC: {
    width: 230,
    height: 45,
    borderRadius: 10,
    margin: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default Login;
