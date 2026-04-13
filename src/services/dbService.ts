import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc,
  getDoc,
  deleteDoc,
  query, 
  where,
  onSnapshot
} from "firebase/firestore";
import { db } from "../lib/firebase";

// --- Users & Profiles ---
export const usersCollection = collection(db, "users");

export const saveUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId);
  return setDoc(userRef, data, { merge: true });
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const deleteUserAccount = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  return deleteDoc(userRef);
};

// --- Patients ---
export const patientsCollection = collection(db, "patients");

export const addPatient = (patientData: {
  therapistId: string;
  name: string;
  age: number;
  dateOfBirth: string;
  tutorName: string;
  tutorContact: string;
  location: string;
  profilePicture?: string;
}) => addDoc(patientsCollection, patientData);

export const getPatientsByTherapist = async (therapistId: string) => {
  const q = query(patientsCollection, where("therapistId", "==", therapistId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Exercises ---
export const exercisesCollection = collection(db, "exercises");

export const getAllExercises = async () => {
  const querySnapshot = await getDocs(exercisesCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Diet Calendars ---
export const dietsCollection = collection(db, "diets");

export const saveDietEntry = (dietData: {
  patientId: string;
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  foods: string[];
  notes?: string;
}) => addDoc(dietsCollection, dietData);

export const listenToPatientDiet = (patientId: string, callback: (data: any) => void) => {
  const q = query(dietsCollection, where("patientId", "==", patientId));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

// --- Agendas & Schedules ---
export const agendaCollection = collection(db, "agendas");

export const scheduleExercise = (scheduleData: {
  exerciseId: string;
  patientId: string;
  therapistId: string;
  startTime: string;
  date: string;
  repeats: string[];
  status: "Pending" | "Done" | "Missed" | "On Course";
}) => addDoc(agendaCollection, scheduleData);

export const listenToTherapistAgenda = (therapistId: string, patientId?: string, callback?: (data: any) => void) => {
  let q = query(agendaCollection, where("therapistId", "==", therapistId));
  if (patientId) {
    q = query(agendaCollection, where("therapistId", "==", therapistId), where("patientId", "==", patientId));
  }
  
  if (!callback) return;
  return onSnapshot(q, (snapshot) => {
    const agenda = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(agenda);
  });
};

export const listenToPatientSchedule = (patientId: string, callback: (data: any) => void) => {
  const q = query(agendaCollection, where("patientId", "==", patientId));
  return onSnapshot(q, (snapshot) => {
    const schedule = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(schedule);
  });
};

// --- Media Logic (Cloudinary) ---
export const uploadMediaToCloudinary = async (file: File) => {
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!preset || preset === "your_upload_preset_here") {
    throw new Error("Cloudinary Upload Preset is missing or not configured in .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data;
};
