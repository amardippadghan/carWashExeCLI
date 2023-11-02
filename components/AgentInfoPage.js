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
import tw from 'twrnc';

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
      behavior="padding"
      style={tw`flex-1 items-center justify-center bg-gray-300  pl-3 pr-3`}>
      <ScrollView contentContainerStyle={tw`items-center`}>
        <Text style={tw`text-2xl text-gray-800 mb-5 mt-12`}>Agent Information</Text>

        {/* Full Name */}
        <View style={tw`w-96 mb-4`}>
          <Text style={tw`text-base text-black mb-1`}>Full Name</Text>
          <TextInput
            style={tw`w-full h-12 bg-white rounded-lg border border-gray-500 shadow px-3 text-lg text-black`}
            placeholder="Enter your full name"
            placeholderTextColor="#000"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
        </View>

        {/* Email */}
        <View style={tw`w-96 mb-4`}>
          <Text style={tw`text-base text-black mb-1`}>Email</Text>
          <TextInput
            style={tw`w-full h-12 bg-white  rounded-lg border border-gray-500 shadow px-3 text-lg text-black`}
            placeholder="Enter your email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
          />
        </View>

        {/* Contact Number */}
        <View style={tw`w-96 mb-4`}>
          <Text style={tw`text-base text-black mb-1`}>Contact Number</Text>
          <TextInput
            style={tw`w-full h-12 bg-white  rounded-lg border border-gray-500 shadow px-3 text-lg text-black`}
            placeholder="Enter your contact number"
            placeholderTextColor="#000"
            value={contactNumber}
            onChangeText={text => setContactNumber(text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Date of Birth */}
        <View style={tw`w-96 mb-4`}>
          <View style={tw`w-96 mb-4`}>
            <Text style={tw`text-base text-black mb-1`}>Date of Birth</Text>
            <TouchableOpacity
              onPress={showDatepicker}
              style={tw`w-full h-12 bg-white  rounded-lg border border-gray-500 shadow justify-center`}>
              <Text style={tw`text-lg text-black px-3`}>
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
        </View>

        {/* Address */}
        <View style={tw`w-96 mb-4`}>
          <Text style={tw`text-base text-black mb-1`}>Address</Text>
          <TextInput
            style={tw`w-full h-12 bg-white  rounded-lg border border-gray-500 shadow px-3 text-lg text-black`}
            placeholder="Enter your address"
            placeholderTextColor="#000"
            value={address}
            onChangeText={text => setAddress(text)}
          />
        </View>

        {/* Password */}
        <View style={tw`w-96 mb-4`}>
          <Text style={tw`text-base text-black mb-1`}>Password</Text>
          <TextInput
            style={tw`w-full h-12 bg-white  rounded-lg border border-gray-500 shadow px-3 text-lg text-black`}
            placeholder="Enter your password"
            secureTextEntry={true}
            placeholderTextColor='#000'
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>

        {/* Confirm Password */}
        <View style={tw`w-96 mb-4`}>
          <Text style={tw`text-base text-black mb-1`}>Confirm Password</Text>
          <TextInput
            style={tw`w-full h-12 bg-white  rounded-lg border border-gray-500 shadow px-3 text-lg text-black`}
            placeholder="Confirm your password"
            secureTextEntry={true}
            placeholderTextColor='#000'
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={tw`w-96 h-12 items-center justify-center  rounded-lg bg-gray-700 mt-6 mb-3`}
          onPress={handleSave}
          disabled={isSaving}>
          <Text style={tw`text-lg text-white`}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

};

export default AgentInfoPage;
