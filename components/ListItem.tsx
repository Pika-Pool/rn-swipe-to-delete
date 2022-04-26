import { FontAwesome5 } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, StyleSheet, Text } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import type { TaskInterface } from '../App'

export interface ListItemProps {
	task: TaskInterface
	onTaskDismiss: () => void
}

const LIST_ITEM_HEIGHT = 70
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.3

export default function ListItem({ task, onTaskDismiss }: ListItemProps) {
	const taskTranslateOffset = useSharedValue(0)
	const taskHeight = useSharedValue(LIST_ITEM_HEIGHT)
	const taskMarginVertical = useSharedValue(5)

	const taskPanGesture = Gesture.Pan()
		.onUpdate(e => {
			taskTranslateOffset.value = e.translationX
		})
		.onEnd(e => {
			const shouldBeDismissed = -e.translationX > TRANSLATE_X_THRESHOLD

			if (shouldBeDismissed) {
				// completely remove from screen
				taskTranslateOffset.value = withTiming(-SCREEN_WIDTH)
				taskMarginVertical.value = withTiming(0, { duration: 250 })
				taskHeight.value = withTiming(
					0,
					void 0,
					isFinished => isFinished && runOnJS(onTaskDismiss)(),
				)
			} else {
				taskTranslateOffset.value = withTiming(0)
			}
		})
		.failOffsetY([-5, 5])
		.activeOffsetX([-5, 5])

	const taskContainerAnimatedStyle = useAnimatedStyle(() => ({
		height: taskHeight.value,
		marginVertical: taskMarginVertical.value,
	}))
	const taskAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: taskTranslateOffset.value }],
	}))
	const trashIconAnimatedStyle = useAnimatedStyle(() => {
		const opacity = -taskTranslateOffset.value >= TRANSLATE_X_THRESHOLD ? 1 : 0
		return {
			opacity: withTiming(opacity, { duration: 150 }),
		}
	})

	return (
		<Animated.View style={[styles.taskContainer, taskContainerAnimatedStyle]}>
			<GestureDetector gesture={taskPanGesture}>
				<Animated.View style={[styles.task, taskAnimatedStyle]}>
					<Text style={styles.taskTitle}>{task.title}</Text>
				</Animated.View>
			</GestureDetector>

			<Animated.View style={[styles.iconContainer, trashIconAnimatedStyle]}>
				<FontAwesome5 name='trash-alt' size={24} color='red' />
			</Animated.View>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	taskContainer: {
		width: '100%',
		alignItems: 'center',
	},
	task: {
		width: '90%',
		height: LIST_ITEM_HEIGHT,
		marginBottom: 5,
		paddingHorizontal: 20,

		justifyContent: 'center',

		backgroundColor: 'white',
		borderRadius: 10,

		// shadow for ios
		shadowColor: 'black',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 20 },
		shadowRadius: 10,
		// shadow for android
		elevation: 10,
	},
	taskTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	iconContainer: {
		position: 'absolute',
		right: '5%',

		height: LIST_ITEM_HEIGHT,
		width: LIST_ITEM_HEIGHT,

		alignItems: 'center',
		justifyContent: 'center',
	},
} as const)
