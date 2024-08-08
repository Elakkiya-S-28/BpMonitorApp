// import React, { useEffect, useState } from 'react';
// import { SafeAreaView, View, Text, StyleSheet, PermissionsAndroid, NativeModules, NativeEventEmitter, FlatList, TouchableOpacity } from 'react-native';
// import BleManager from 'react-native-ble-manager';

// export const MainScreen = () => {
//     const [isScanning, setIsScanning] = useState(false); //scanning
//     const [bleDevices, setDevices] = useState([]); //To store the device
//     const BleManagerModule = NativeModules.BleManager;
//     const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
//     const [currentDevices, setCurrentDevices] = useState<any>(null);
//     useEffect(() => {
//         // Start the Bluetooth manager once, when the component mounts
//         BleManager.start({ showAlert: false }).then(() => {
//             console.log("Module initialized");
//         });
//     }, []); // Empty dependency array ensures this runs only once on mount

//     useEffect(() => {
//         // Enable Bluetooth once, when the component mounts
//         BleManager.enableBluetooth()
//             .then(() => {
//                 console.log("Bluetooth is enabled or the user confirmed");
//                 requestPermission();
//             })
//             .catch((error) => {
//                 console.log("The user refused to enable Bluetooth");
//             });
//     }, []); // Empty dependency array ensures this runs only once on mount

//     useEffect(() => {
//         // Listener for when scanning stops
//         const stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
//             setIsScanning(false);
//             handleGetConnectedDevices();
//             console.log("Scan stopped");
//         });

//         // Cleanup function to remove the listener when the component unmounts
//         return () => {
//             stopListener.remove();
//         };
//     }, []); // Empty dependency array ensures this runs only once on mount

//     const requestPermission = async () => {
//         const granted = await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//         ]);
//         if (granted) {
//             startScanning();
//         }
//     };

//     const startScanning = () => {
//         if (!isScanning) {
//             BleManager.scan([], 10, false)
//                 .then(() => {
//                     console.log("Scan started");
//                     setIsScanning(true);
//                 })
//                 .catch((error) => {
//                     console.log(error, "Error message");
//                 });
//         }
//     };

//     const handleGetConnectedDevices = () => {
//         BleManager.getDiscoveredPeripherals().then((peripheralsArray) => {
//             if (peripheralsArray.length === 0) {
//                 console.log("No Device Found");
//                 startScanning();
//             } else {
//                 console.log("Results", JSON.stringify(peripheralsArray));
//                 const allDevices = peripheralsArray.filter((item) => item.name !== null);
//                 setDevices(allDevices);
//             }
//             console.log("Discovered peripherals: " + peripheralsArray);
//         });
//     };
//     const onConnect = async (item: any) => {
//         try {
//             await BleManager.connect(item.id);
//             setCurrentDevices(item);
//             const result = await BleManager.retrieveServices(item.id);
//             console.log('Resulting....', result)
//             onServiceDiscover(result, item)
//         }
//         catch (error) {
//             console.log(error, "onConnect Error")
//         }
//     }

//     const onServiceDiscover = (result: any, item: any) => {
//         const services = result.services;
//         const characteristics = result.characteristics;
//         services.forEach((service: any) => {
//             const serviceUUID = service.uuid
//             onChangeCharacteristics(serviceUUID, characteristics, item)
//         })
//     }

//     const onChangeCharacteristics = (serviceUUID: any, result: any, item: any) => {
//       result.forEach((characteristics: any) => {
//         const characteristicsUUID= characteristics.charcteristic;
//       })
//     }
//     const renderItem = ({ item, index }) => {
//         return (
//             <View style={styles.bleCard}>
//                 <Text style={styles.bleText}>{item.name}</Text>
//                 <TouchableOpacity style={styles.button} onPress={() => onConnect(item)}>
//                     <Text style={[styles.bleText, { color: 'white' }]}>Connect</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             {isScanning ? (
//                 <View style={{ marginTop: '50%', alignSelf: 'center', justifyContent: 'center' }}>
//                     <Text style={styles.text}>Scanning....</Text>
//                 </View>
//             ) : (
//                 <FlatList data={bleDevices} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
//             )}
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     text: {
//         fontSize: 14,
//         color: 'black',
//         alignItems: 'center',
//         alignContent: 'center',
//         justifyContent: 'center',
//     },
//     bleCard: {
//         width: '90%',
//         padding: 10,
//         alignSelf: 'center',
//         marginVertical: 10,
//         backgroundColor: 'pink',
//         elevation: 5,
//         borderRadius: 5,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     bleText: {
//         fontFamily: 'Mulish',
//         fontSize: 16,
//         color: 'black',
//         fontWeight: 'bold',
//     },
//     button: {
//         width: 100,
//         height: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'black',
//     },
// });



import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, PermissionsAndroid, NativeModules, NativeEventEmitter, FlatList, TouchableOpacity } from 'react-native';
import BleManager from 'react-native-ble-manager';

const MainScreen = () => {
    const [isScanning, setIsScanning] = useState(false); // Scanning state
    const [bleDevices, setDevices] = useState([]); // To store BLE devices
    const [currentDevices, setCurrentDevices] = useState(null); // Current connected device
    const BleManagerModule = NativeModules.BleManager;
    const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

    useEffect(() => {
        // Start the Bluetooth manager once, when the component mounts
        BleManager.start({ showAlert: false }).then(() => {
            console.log("Module initialized");
        });

        // Enable Bluetooth and request permissions
        BleManager.enableBluetooth()
            .then(() => {
                console.log("Bluetooth is enabled or the user confirmed");
                requestPermission();
            })
            .catch((error) => {
                console.log("The user refused to enable Bluetooth");
            });

        // Listener for when scanning stops
        const stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
            setIsScanning(false);
            handleGetDiscoveredDevices();
            console.log("Scan stopped");
        });

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            stopListener.remove();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    const requestPermission = async () => {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        if (
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_ADVERTISE'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
            startScanning();
        } else {
            console.log("Permissions denied");
        }
    };

    const startScanning = () => {
        if (!isScanning) {
            BleManager.scan([], 10, false)
                .then(() => {
                    console.log("Scan started");
                    setIsScanning(true);
                })
                .catch((error) => {
                    console.log("Scan error:", error);
                });
        }
    };

    const handleGetDiscoveredDevices = () => {
        BleManager.getDiscoveredPeripherals()
            .then((peripheralsArray) => {
                if (peripheralsArray.length === 0) {
                    console.log("No Device Found");
                    startScanning();
                } else {
                    console.log("Discovered peripherals:", peripheralsArray);
                    const allDevices = peripheralsArray.filter((item) => item.name);
                    setDevices(allDevices);
                }
            })
            .catch((error) => {
                console.log("Error getting peripherals:", error);
            });
    };

    const onConnect = async (item) => {
        try {
            await BleManager.connect(item.id);
            setCurrentDevices(item);
            const result = await BleManager.retrieveServices(item.id);
            console.log('Services retrieved:', result);
            // Handle service discovery and characteristics here if needed
        } catch (error) {
            console.log("Connection error:", error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.bleCard}>
            <Text style={styles.bleText}>{item.name || "Unnamed Device"}</Text>
            <TouchableOpacity style={styles.button} onPress={() => onConnect(item)}>
                <Text style={[styles.bleText, { color: 'white' }]}>Connect</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {isScanning ? (
                <View style={styles.scanStatus}>
                    <Text style={styles.text}>Scanning....</Text>
                </View>
            ) : (
                <FlatList
                    data={bleDevices}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scanStatus: {
        marginTop: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    bleCard: {
        width: '90%',
        padding: 10,
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: 'pink',
        elevation: 5,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bleText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    button: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
});

export default MainScreen;
