import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8D8D8',
    paddingTop: 60,
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontFamily: 'sans-serif',
    fontSize: 24,
    color: '#171A1FFF',
    marginBottom: 20,
  },
  text2: {
    marginLeft: -160,
    color: '#000000',
  },
  text3: {
    marginLeft: -200,
    color: '#000000',
  },
  inputContainer: {
    width: 339,
    height: 52,
    backgroundColor: '#FFFFFFFF',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#9095A0FF',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: '#000000',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontFamily: 'sans-serif',
    paddingTop: 10,
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
  },
  buttonContainer: {
    width: 339,
  },
  button: {
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#FFFFFFFF',
    backgroundColor: '#5B7586',
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'sans-serif',
    fontSize: 18,
    color: '#FFFFFFFF',
  },
  verificationStatus: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: '#FF0000',
  },
});

export default function Login() {
  const [loginNumber, setLoginNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigation = useNavigation();

  const handlesignup = () => {
    navigation.navigate('signup');
  };

  const verifyMobileNumber = async () => {
    if (isLoggingIn) {
      return;
    }
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      console.log(result);
    
    });

    setIsLoggingIn(true);

    try {
      const response = await axios.post(
        'https://car-wash-backend-api.onrender.com/api/agents/login',
        {
          ident: loginNumber,
          password: password,
        },
      );

      if (response.data.verified) {
        await AsyncStorage.setItem('userId', response.data.agent._id);

        setVerificationStatus('Mobile number is verified.');
        navigation.navigate('Home');
      } else {
        setVerificationStatus(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying mobile number:', error);
      setVerificationStatus('Error verifying mobile number. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then(userId => {
        if (userId) {
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.error('Error checking AsyncStorage:', error);
      });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>Log in</Text>
        <Text style={styles.text2}>Enter Your Mobile Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#000000"
            keyboardType="phone-pad"
            required
            maxLength={10}
            onChangeText={text => setLoginNumber(text)}
          />
        </View>
        <Text style={styles.text3}>Entre your Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#000000"
            secureTextEntry={true}
            required
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={verifyMobileNumber}
            disabled={isLoggingIn}>
            <Text style={styles.buttonText}>
              {isLoggingIn ? 'Logging in...' : 'Continue'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlesignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {verificationStatus ? (
          <Text style={styles.verificationStatus}>{verificationStatus}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
