import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, Camera } from "expo-camera";
import { useState } from "react";


//*El proyecto tiene que llevar el archivo babel.config.js

//*Esta configuracion tiene que ir en el archivo app.json
//* "plugins": ["expo-router",["expo-camera",{
//*   "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
//*   "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
//*   "recordAudioAndroid": true
//* }]]

export default function RootLayout() {
  const [facing, setFacing] = useState("back");
  const [permission, setPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  const permissionsCamera = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setPermission(cameraStatus);
    setShowCamera(true);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={permissionsCamera} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function closeCamera() {
    setPermission(null);
    setShowCamera(false);
    setImage(null);
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showCamera && (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={(ref) => setCamera(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={closeCamera}>
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take a picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
