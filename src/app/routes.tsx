import { createBrowserRouter, redirect, Navigate } from "react-router";
import { Root } from "./components/Root";
import { Landing } from "./components/Landing";
import { TherapistHome } from "./components/TherapistHome";
import { MyPatients } from "./components/MyPatients";
import { PatientProfile } from "./components/PatientProfile";
import { SensoryDiet } from "./components/SensoryDiet";
import { ScheduleExercise } from "./components/ScheduleExercise";
import { RegisterTherapist } from "./components/RegisterTherapist";
import { TutorHome } from "./components/TutorHome";
import { CaregiverRegister } from "./components/CaregiverRegister";
import { ExerciseDetail } from "./components/ExerciseDetail";
import { EditExercise } from "./components/EditExercise";
import { TherapistExerciseDetail } from "./components/TherapistExerciseDetail";
import { EmergencyExercise } from "./components/EmergencyExercise";
import { ExerciseLibrary } from "./components/ExerciseLibrary";
import { Calendar } from "./components/Calendar";
import { Messages } from "./components/Messages";
import { MyProfile } from "./components/MyProfile";
import { PatientList } from "./components/PatientList";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      // Therapist routes
      { path: "therapist/register", Component: RegisterTherapist },
      { path: "therapist/home", Component: TherapistHome },
      { path: "therapist/patients", Component: PatientList },
      { path: "therapist/patients/:id", Component: PatientProfile },
      { path: "therapist/patients/:id/diet", Component: SensoryDiet },
      { path: "therapist/patients/:patientId/schedule/:exerciseId", Component: ScheduleExercise },
      { path: "therapist/patients/:patientId/schedule", Component: ScheduleExercise },
      { path: "therapist/exercise-library", element: <ExerciseLibrary userType="therapist" /> },
      { path: "therapist/exercise/:id", Component: TherapistExerciseDetail },
      { path: "therapist/exercise/:id/edit", Component: EditExercise },
      { path: "therapist/calendar", element: <Calendar userType="therapist" /> },
      { path: "therapist/messages", element: <Messages userType="therapist" /> },
      { path: "therapist/my-profile", element: <MyProfile userType="therapist" /> },
      // Caregiver routes
      { path: "caregiver/register", Component: CaregiverRegister },
      { path: "caregiver/home", Component: TutorHome },
      { path: "caregiver/exercise/:id", Component: ExerciseDetail },
      { path: "caregiver/exercise-detail", Component: ExerciseDetail },
      { path: "caregiver/edit-exercise", Component: EditExercise },
      { path: "caregiver/emergency", Component: EmergencyExercise },
      { path: "caregiver/exercise-library", element: <ExerciseLibrary userType="caregiver" /> },
      { path: "caregiver/calendar", element: <Calendar userType="caregiver" /> },
      { path: "caregiver/messages", element: <Messages userType="caregiver" /> },
      { path: "caregiver/my-profile", element: <MyProfile userType="caregiver" /> },
      // Legacy routes - redirect to therapist routes (order matters - most specific first)
      { 
        path: "patients/:patientId/schedule/:exerciseId",
        loader: ({ params }) => redirect(`/therapist/patients/${params.patientId}/schedule/${params.exerciseId}`),
      },
      { 
        path: "patients/:patientId/schedule",
        loader: ({ params }) => redirect(`/therapist/patients/${params.patientId}/schedule`),
      },
      { 
        path: "patients/:id/diet",
        loader: ({ params }) => redirect(`/therapist/patients/${params.id}/diet`),
      },
      { 
        path: "patients/:id",
        loader: ({ params }) => redirect(`/therapist/patients/${params.id}`),
      },
      { 
        path: "patients",
        loader: () => redirect("/therapist/patients"),
      },
      { 
        path: "home",
        loader: () => redirect("/therapist/home"),
      },
    ],
  },
]);