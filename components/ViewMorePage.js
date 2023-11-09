import React from 'react';
import {View, Text, FlatList, useColorScheme} from 'react-native';
import tw from 'twrnc';

const ViewMorePage = ({route}) => {
  const {customer} = route.params;
  console.warn(customer);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const renderRow = ({item}) => (
    <View style={tw`flex-row justify-between mb-4`}>
      <Text
        style={[
          tw`text-lg font-bold`,
          {color: isDarkMode ? '#E5E7EB' : '#000'},
        ]}>
        {item.label}
      </Text>
      <Text style={[tw`text-lg`, {color: isDarkMode ? '#E5E7EB' : '#000'}]}>
        {item.value}
      </Text>
    </View>
  );

  const data = [
    {label: 'Customer Name:', value: customer?.clientName},
    {label: 'Service:', value: customer?.servicesName},
    {label: 'Client Contact:', value: customer?.clientContact},
    {label: 'Date:', value: customer?.date},
    {label: 'Time:', value: customer?.time},
    {label: 'Total Price:', value: `₹ ${customer?.totalPrice}`},
    {label: 'Pickup Address:', value: customer?.pickupAddress},
    {label: 'Client Vehicle No:', value: customer?.clientvehicleno},
    {label: 'Vehicle Model:', value: customer?.clientcarmodelno},
    {label: 'Status:', value: customer?.status},
  ];

  return (
    <View
      style={tw`flex-1 justify-center  items-center ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
      }`}>
      <View
        style={tw`w-full p-6 mb-16 rounded-xl shadow-md ${
          isDarkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
        <FlatList
          data={data}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default ViewMorePage;
