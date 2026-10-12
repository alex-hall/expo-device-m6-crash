# expo-device crashes in the iOS simulator on Apple M6 Macs

Minimal reproduction for a crash in `expo-device`'s `cpuArchitectures()`.

## Steps

```sh
npm install
npx expo run:ios
```

On an Apple M6 Mac (Mac18,5, macOS 27.0.1, Xcode 26.6, iOS 26.5 simulator
runtime), the app crashes with `EXC_BREAKPOINT` (SIGTRAP) as soon as
[`App.tsx`](App.tsx) reads `Device.supportedCpuArchitectures`.

On an Apple M4 Mac, the same app shows `supportedCpuArchitectures: ["arm64e"]`.

## Cause

`packages/expo-device/ios/DeviceModule.swift`:

```swift
func cpuArchitectures() -> [String]? {
  guard let archRaw = NXGetLocalArchInfo().pointee.name else {
    return nil
  }
  return [String(cString: archRaw)]
}
```

`NXGetLocalArchInfo()` returns NULL inside the iOS 26.5 simulator on an M6
host, whose CPU subtype is 12 (`arm64e.x1`; M4 hosts report 2). `.pointee`
then traps.

The same lookup without Expo, compiled for the simulator and run with
`xcrun simctl spawn <booted-udid> ./nxsim`:

```swift
import MachO
let p = NXGetLocalArchInfo()
print(p == nil ? "nil" : String(cString: p!.pointee.name))
```

| Where it runs                       | Output      |
| ----------------------------------- | ----------- |
| macOS 27.0.1 host, M6               | `arm64e.x1` |
| iOS 26.5 simulator on that M6 host  | `nil`       |
| macOS 26.3 host, M4 Max             | `arm64e`    |

The project is a stock `create-expo-app` blank TypeScript template plus
`npx expo install expo-device`; `App.tsx` is the only file changed.
