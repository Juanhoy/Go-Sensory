export const patients = [
  {
    id: "1",
    name: "Emmanuel Rodriguez",
    age: 5,
    dateOfBirth: "April 15 2019",
    tutor: "Andrea Silva (Mother)",
    location: "Forthlauderdale, FL",
    status: "Overwhelmed" as const,
  },
  {
    id: "2",
    name: "Julian Benitez",
    age: 6,
    dateOfBirth: "March 10 2018",
    tutor: "Maria Benitez (Mother)",
    location: "Miami, FL",
    status: "Calm" as const,
  },
  {
    id: "3",
    name: "Anna Varsky",
    age: 7,
    dateOfBirth: "July 22 2017",
    tutor: "John Varsky (Father)",
    location: "Orlando, FL",
    status: "Energetic" as const,
  },
];

export const exercises = [
  {
    id: "ex1",
    name: "Jumping Jacks x 20",
    type: "Activate" as const,
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    duration: 15,
  },
  {
    id: "ex2",
    name: "Tactile Treasure Hunt",
    type: "Activate" as const,
    description: "This exercise will help the patient to activate his muscles and spend a bit of e...",
    duration: 15,
  },
  {
    id: "ex3",
    name: "Inhale and exhale for 10 minutes",
    type: "Relaxing" as const,
    description: "Deep breathing exercise to help calm and center the patient",
    duration: 10,
  },
  {
    id: "ex4",
    name: "Sensory Bin Exploration",
    type: "Stimulate" as const,
    description: "Explore different textures to stimulate tactile senses",
    duration: 20,
  },
  {
    id: "ex5",
    name: "Balance Beam Walk",
    type: "Concentrate" as const,
    description: "Improve focus and balance through controlled movement",
    duration: 15,
  },
];

export const scheduledExercises = [
  {
    id: "sch1",
    exerciseId: "ex3",
    patientId: "1",
    startTime: "10:00 AM",
    repeats: ["Mon", "Tue", "Fri", "Thu", "Sa", "Su"],
    status: "Pending" as const,
  },
  {
    id: "sch2",
    exerciseId: "ex1",
    patientId: "1",
    startTime: "2:30 PM",
    repeats: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "Done" as const,
  },
  {
    id: "sch3",
    exerciseId: "ex4",
    patientId: "1",
    startTime: "4:00 PM",
    repeats: ["Mon", "Wed", "Fri"],
    status: "Missed" as const,
  },
  {
    id: "sch4",
    exerciseId: "ex5",
    patientId: "1",
    startTime: "6:00 PM",
    repeats: ["Daily"],
    status: "On Course" as const,
  },
];
