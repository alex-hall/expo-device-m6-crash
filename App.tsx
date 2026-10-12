import * as Device from 'expo-device';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Reading this constant runs cpuArchitectures() in DeviceModule.swift, which
// force-unwraps NXGetLocalArchInfo(). In the iOS simulator on an Apple M6 Mac
// that returns NULL and the app crashes with EXC_BREAKPOINT before this
// screen renders. Elsewhere it prints something like ["arm64e"].
const architectures = Device.supportedCpuArchitectures;

export default function App() {
  return (
    <View style={styles.container}>
      <Text>supportedCpuArchitectures: {JSON.stringify(architectures)}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
