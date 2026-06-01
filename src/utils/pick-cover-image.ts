import { showActionSheet } from '@/utils/show-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [2, 3],
    quality: 0.8,
};

async function takePhoto(): Promise<string | null> {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
        Alert.alert(
            'Camera permission needed',
            'Enable camera access in Settings to take a photo.',
        );
        return null;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    return result.canceled ? null : result.assets[0].uri;
}

async function pickFromLibrary(): Promise<string | null> {
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    return result.canceled ? null : result.assets[0].uri;
}

/**
 * Prompts the user to take a photo or choose an existing one, then resolves with
 * the selected image URI (or null if they cancelled or denied camera access).
 * Uses a native action sheet on iOS and an alert dialog on Android.
 */
export function pickCoverImage(hasExisting = false): Promise<string | null> {
    const title = hasExisting ? 'Change cover image' : 'Add cover image';

    return new Promise((resolve) => {
        showActionSheet(title, undefined, [
            { text: 'Take Photo', onPress: () => resolve(takePhoto()) },
            { text: 'Choose from Library', onPress: () => resolve(pickFromLibrary()) },
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
        ]);
    });
}
