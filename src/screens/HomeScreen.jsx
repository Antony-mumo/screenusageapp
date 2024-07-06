import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Picker } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUsage } from '../components/usage';

const HomeScreen = () => {
    const [usageData, setUsageData] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [apps, setApps] = useState([]);

    const fetchUsage = useCallback(async () => {
        const usage = await getUsage();
        setUsageData(usage);
        setApps(Object.keys(usage));
    }, []);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Button title="Refresh Usage Data" onPress={fetchUsage} />
                {usageData ? (
                    <View>
                        <Picker
                            selectedValue={selectedApp}
                            onValueChange={(itemValue) => setSelectedApp(itemValue)}
                        >
                            {apps.map((app) => (
                                <Picker.Item key={app} label={app} value={app} />
                            ))}
                        </Picker>
                        {selectedApp && (
                            <Text>{`${selectedApp}: ${usageData[selectedApp]} ms`}</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.main}>
                        <ActivityIndicator size="small" />
                        <Text style={styles.load}>Loading...</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        justifyContent: 'center',
    },
    load: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HomeScreen;