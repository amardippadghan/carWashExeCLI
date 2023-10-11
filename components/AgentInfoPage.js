import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const AgentInfoPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Initialize with today's date
  const [isSaving, setIsSaving] = useState(false);
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const phoneNumberPattern = /^[2-9]{1}[0-9]{9}$/;
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!phoneNumberPattern.test(contactNumber)) {
      Alert.alert(
        'Invalid Contact Number',
        'Please enter a valid contact number.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0];

    setIsSaving(true);

    const formData = {
      fullName,
      email,
      contactNumber,
      dateOfBirth: formattedDateOfBirth,
      address,
      password,
      profilePic,
    };

    try {
      const response = await axios.post(
        'https://car-wash-backend-api.onrender.com/api/agents',
        formData,
      );

      console.log(response.data);
      Alert.alert('Success', 'Data is saved, go to the login page');

      navigation.navigate('Login');

      setFullName('');
      setEmail('');
      setContactNumber('');
      setDateOfBirth(new Date());
      setAddress('');
      setPassword('');
      setConfirmPassword('');
      setProfilePic(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>Agent Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#000"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="Enter your contact number"
            value={contactNumber}
            onChangeText={text => setContactNumber(text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={styles.datePickerText}>
              {dateOfBirth.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateOfBirth}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={address}
            placeholderTextColor="#000"
            onChangeText={text => setAddress(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}>
          {isSaving ? (
            <Text style={styles.buttonText}>Saving...</Text>
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8D8D8',
    paddingTop: 30,
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
  label: {
    fontFamily: 'sans-serif',
    fontSize: 14,
    color: '#040D12',
    marginBottom: 3,
  },
  inputContainer: {
    width: 339,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 49,
    backgroundColor: '#FFFFFFFF',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#9095A0FF',
    borderStyle: 'solid',
    shadowColor: '#171a1f',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    paddingHorizontal: 15,
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: '#171A1FFF',
  },
  datePickerText: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: '#171A1FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#9095A0FF',
    paddingBottom: 5,
  },
  button: {
    width: 342,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Sans-serif',
    fontSize: 18,
    lineHeight: 28,
    color: '#FFFFFFFF',
    backgroundColor: '#5B7586',
    borderRadius: 4,
    marginTop: 30,
  },
  buttonText: {
    fontFamily: 'Sans-serif',
    fontSize: 18,
    lineHeight: 28,
    color: '#FFFFFFFF',
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
});

export default AgentInfoPage;
