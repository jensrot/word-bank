import { ActionSheetIOS, Alert, Platform } from 'react-native';

export type ActionSheetButton = {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
};

/**
 * Platform-aware prompt: a native action sheet on iOS, a normal Alert dialog on
 * Android. Buttons use the same shape as Alert's buttons — mark the dismiss
 * action with style 'cancel' and any dangerous action with style 'destructive'.
 */
export function showActionSheet(
    title: string | undefined,
    message: string | undefined,
    buttons: ActionSheetButton[],
): void {
    if (Platform.OS === 'ios') {
        const cancelButtonIndex = buttons.findIndex((b) => b.style === 'cancel');
        const destructiveButtonIndex = buttons.findIndex((b) => b.style === 'destructive');
        ActionSheetIOS.showActionSheetWithOptions(
            {
                title,
                message,
                options: buttons.map((b) => b.text),
                cancelButtonIndex: cancelButtonIndex === -1 ? undefined : cancelButtonIndex,
                destructiveButtonIndex: destructiveButtonIndex === -1 ? undefined : destructiveButtonIndex,
            },
            (index) => buttons[index]?.onPress?.(),
        );
    } else {
        // Tapping outside the dialog should behave like the cancel button.
        const cancelButton = buttons.find((b) => b.style === 'cancel');
        Alert.alert(title ?? '', message, buttons, {
            cancelable: true,
            onDismiss: cancelButton?.onPress,
        });
    }
}
