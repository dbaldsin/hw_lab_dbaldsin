import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db, firebaseConfigured, usingEmulator } from '../config/firebase';
import { compareTasksForList, isValidTask, TaskItem } from '../models/TaskItem';

type TasksContextValue = {
  tasks: TaskItem[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<TaskItem, 'id'>) => Promise<void>;
  updateTask: (task: TaskItem) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompleted: (task: TaskItem) => Promise<void>;
};
const canConnect = firebaseConfigured || usingEmulator;
const missingConfiguration = 'Firebase is not configured. Follow FIREBASE_SETUP.md to connect your project.';
const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/** Subscribe once for the app and expose Firestore CRUD through shared context. */
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(canConnect);
  const [error, setError] = useState<string | null>(canConnect ? null : missingConfiguration);

  // Unsubscribe on unmount so switching screens never creates extra listeners.
  useEffect(function subscribeToTasks() {
    if (!canConnect) return;
    return onSnapshot(collection(db, 'tasks'),
      // Convert timestamps at the boundary; all views use ordinary Dates.
      function receiveTasks(snapshot) {
        try {
          const next = snapshot.docs.map(function decodeTask(record): TaskItem {
            const data = record.data();
            if (!(data.dueDate instanceof Timestamp) || !(data.dateAdded instanceof Timestamp)) {
              throw new Error('Task date fields must be Firestore timestamps, not strings.');
            }
            return { id: record.id, name: data.name, assignedTo: data.assignedTo,
              dueDate: data.dueDate.toDate(), dateAdded: data.dateAdded.toDate(), completed: data.completed ?? false };
          });
          setTasks(next.sort(compareTasksForList));
          setError(null);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'Unable to read tasks.');
        }
        setLoading(false);
      },
      // Surface permission/network failures instead of displaying a misleading empty list.
      function receiveError(cause) {
        setError(cause.message);
        setLoading(false);
      });
  }, []);

  /** Validate and create a document; Firestore assigns its ID. */
  async function addTask(task: Omit<TaskItem, 'id'>) {
    if (!canConnect) throw new Error(missingConfiguration);
    if (!isValidTask(task.name, task.assignedTo)) throw new Error('Name and assignee are required.');
    await addDoc(collection(db, 'tasks'), { ...task, name: task.name.trim(), assignedTo: task.assignedTo.trim(),
      dueDate: Timestamp.fromDate(task.dueDate), dateAdded: Timestamp.fromDate(task.dateAdded) });
  }
  /** Update editable fields while preserving the original creation timestamp. */
  async function updateTask(task: TaskItem) {
    if (!canConnect) throw new Error(missingConfiguration);
    if (!task.id) throw new Error('Cannot update a task without an ID.');
    if (!isValidTask(task.name, task.assignedTo)) throw new Error('Name and assignee are required.');
    await updateDoc(doc(db, 'tasks', task.id), { name: task.name.trim(), assignedTo: task.assignedTo.trim(),
      dueDate: Timestamp.fromDate(task.dueDate), completed: task.completed });
  }
  /** Delete the document selected by its stable Firestore ID. */
  async function deleteTask(id: string) {
    if (!canConnect) throw new Error(missingConfiguration);
    await deleteDoc(doc(db, 'tasks', id));
  }
  /** Toggle completion without rewriting any of the other task fields. */
  async function toggleCompleted(task: TaskItem) {
    if (!canConnect) throw new Error(missingConfiguration);
    if (!task.id) throw new Error('Cannot toggle a task without an ID.');
    await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
  }
  return <TasksContext.Provider value={{ tasks, loading, error, addTask, updateTask, deleteTask, toggleCompleted }}>{children}</TasksContext.Provider>;
}
/** Read the shared task store and detect a missing provider early. */
export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used inside a TasksProvider.');
  return context;
}
