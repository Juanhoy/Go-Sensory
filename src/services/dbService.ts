import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot
} from "firebase/firestore";
import { db } from "../lib/firebase";

// --- Patients ---
export const patientsCollection = collection(db, "patients");

export const addPatient = (patientData: any) => addDoc(patientsCollection, patientData);

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

// --- Agendas & Schedules ---
export const agendaCollection = collection(db, "agendas");

export const scheduleExercise = (scheduleData: {
  exerciseId: string;
  patientId: string;
  startTime: string;
  repeats: string[];
  status: "Pending" | "Done" | "Missed" | "On Course";
}) => addDoc(agendaCollection, scheduleData);

export const listenToTherapistAgenda = (therapistId: string, callback: (data: any) => void) => {
  const q = query(agendaCollection, where("therapistId", "==", therapistId));
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
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return response.json();
};
