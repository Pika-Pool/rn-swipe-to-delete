import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useState } from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import ListItem from './components/ListItem'

const titles = [
	'Record the dismissible tutorial 🎥',
	'Leave 👍🏼 to the video',
	'Check YouTube comments',
	'Subscribe to the channel 🚀',
	'Leave a ⭐️ on the GitHub Repo',
	'Leave 👍🏼 to the video',
	'Check YouTube comments',
	'Subscribe to the channel 🚀',
	'Leave a ⭐️ on the GitHub Repo',
	'Leave 👍🏼 to the video',
	'Check YouTube comments',
	'Subscribe to the channel 🚀',
	'Leave a ⭐️ on the GitHub Repo',
]

export interface TaskInterface {
	title: string
	id: number
}

const TASKS: TaskInterface[] = titles.map((title, id) => ({ title, id }))

// const TASKS = [
//   {
//     index: 0,
//     title: 'Record the dismissible tutorial 🎥',
//   },
//   { ... }, { ... }, { ... }
// ];

const BACKGROUND_COLOR = '#FAFBFF'

export default function App() {
	const [tasks, setTasks] = useState(TASKS)

	/** @returns curried handler to delete task */
	const onTaskDelete = useCallback((taskId: number) => {
		return function () {
			setTasks(tasks => tasks.filter(task => task.id !== taskId))
		}
	}, [])

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<StatusBar style='auto' />
				<Text style={styles.title}>TASKS</Text>

				<FlatList
					style={styles.list}
					data={tasks}
					renderItem={({ item: task }) => (
						<ListItem onTaskDismiss={onTaskDelete(task.id)} task={task} />
					)}
					keyExtractor={task => task.id.toString()}
				/>
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BACKGROUND_COLOR,
		marginTop: 15,
	},
	title: {
		fontSize: 60,
		marginVertical: 10,
		paddingStart: '2.5%',
	},
	list: {
		flex: 1,
	},
} as const)
