// This file simulates backend responses for development

// Mock token generator
export const generateMockToken = (email) => {
  return `mock_${email}_${Date.now()}`;
};

// Mock users
export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor'
  },
  {
    id: 3,
    name: 'Nurse Smith',
    email: 'nurse@hospital.com',
    password: 'nurse123',
    role: 'nurse'
  }
];

// Mock login function
export const mockLogin = (credentials) => {
  const { email, password } = credentials;
  const user = mockUsers.find(user => user.email === email && user.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateMockToken(email);
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// Mock register function
export const mockRegister = (userData) => {
  // Check if email already exists
  if (mockUsers.some(user => user.email === userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    ...userData
  };
  
  mockUsers.push(newUser);
  
  const token = generateMockToken(userData.email);
  
  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  };
};

// Mock dashboard stats
export const mockDashboardStats = {
  totalPatients: 1250,
  totalDoctors: 75,
  totalAppointments: 3450,
  todayAppointments: 42
};

// Mock Doctors
export const mockDoctors = [
  {
    id: '1',
    name: 'Dr. James Smith',
    email: 'james.smith@example.com',
    specialization: 'Cardiology',
    experience: 12,
    qualifications: 'MD, MBBS, Cardiology',
    phone: '555-123-4567',
    address: '123 Medical Center Blvd, New York, NY',
    availableHours: '9:00 AM - 5:00 PM',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    specialization: 'Neurology',
    experience: 8,
    qualifications: 'MD, Neurology, MBBS',
    phone: '555-234-5678',
    address: '456 Neuro Sciences Ave, Boston, MA',
    availableHours: '10:00 AM - 6:00 PM',
    availableDays: ['Monday', 'Thursday', 'Friday'],
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-02-10T09:15:00Z'
  },
  {
    id: '3',
    name: 'Dr. Robert Williams',
    email: 'robert.williams@example.com',
    specialization: 'Orthopedics',
    experience: 15,
    qualifications: 'MBBS, MS Orthopedics',
    phone: '555-345-6789',
    address: '789 Bone & Joint St, Chicago, IL',
    availableHours: '8:00 AM - 4:00 PM',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    createdAt: '2023-01-20T10:45:00Z',
    updatedAt: '2023-01-20T10:45:00Z'
  },
  {
    id: '4',
    name: 'Dr. Lisa Chen',
    email: 'lisa.chen@example.com',
    specialization: 'Pediatrics',
    experience: 10,
    qualifications: 'MD, DCH, MBBS',
    phone: '555-456-7890',
    address: '234 Children\'s Health Blvd, San Francisco, CA',
    availableHours: '9:00 AM - 5:00 PM',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    createdAt: '2023-03-05T08:30:00Z',
    updatedAt: '2023-03-05T08:30:00Z'
  }
];

// Mock Patients
export const mockPatients = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-111-2222',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123 Main St, Anytown, CA',
    dateOfBirth: '1985-07-15',
    medicalHistory: 'Hypertension, diagnosed in 2018. Taking regular medication.',
    createdAt: '2023-04-10T09:20:00Z',
    updatedAt: '2023-04-10T09:20:00Z'
  },
  {
    id: '2',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '555-222-3333',
    gender: 'Male',
    bloodGroup: 'A+',
    address: '456 Oak Ave, Somewhere, NY',
    dateOfBirth: '1978-03-22',
    medicalHistory: 'Type 2 diabetes, managed with diet and exercise. Regular check-ups every 3 months.',
    createdAt: '2023-03-18T14:30:00Z',
    updatedAt: '2023-03-18T14:30:00Z'
  },
  {
    id: '3',
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '555-333-4444',
    gender: 'Female',
    bloodGroup: 'B-',
    address: '789 Pine Rd, Elsewhere, TX',
    dateOfBirth: '1990-11-05',
    medicalHistory: 'Asthma since childhood. Carries emergency inhaler.',
    createdAt: '2023-04-22T11:15:00Z',
    updatedAt: '2023-04-22T11:15:00Z'
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '555-444-5555',
    gender: 'Male',
    bloodGroup: 'AB+',
    address: '101 Cedar Blvd, Anystate, FL',
    dateOfBirth: '1965-09-28',
    medicalHistory: 'History of lower back pain. Had surgery in 2019. Regular physical therapy.',
    createdAt: '2023-02-15T10:45:00Z',
    updatedAt: '2023-02-15T10:45:00Z'
  },
  {
    id: '5',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    phone: '555-555-6666',
    gender: 'Female',
    bloodGroup: 'O-',
    address: '202 Maple St, Sometown, WA',
    dateOfBirth: '1992-05-17',
    medicalHistory: 'Allergic to penicillin. No other significant medical history.',
    createdAt: '2023-03-30T15:20:00Z',
    updatedAt: '2023-03-30T15:20:00Z'
  },
  {
    id: '6',
    name: 'Jennifer Adams',
    email: 'jennifer.adams@example.com',
    phone: '555-666-7777',
    gender: 'Female',
    bloodGroup: 'A-',
    address: '303 Elm Rd, Another City, IL',
    dateOfBirth: '1980-12-03',
    medicalHistory: 'Hypothyroidism, diagnosed in 2017. Taking daily medication.',
    createdAt: '2023-05-05T09:10:00Z',
    updatedAt: '2023-05-05T09:10:00Z'
  }
];

// Generate dates for appointments
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Mock Appointments
export const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    date: '2023-06-15',
    time: '10:30',
    duration: 30,
    type: 'Consultation',
    status: 'completed',
    symptoms: 'Recurring headaches and dizziness for the past week',
    notes: 'Patient should avoid screens before bedtime and stay hydrated',
    createdAt: '2023-06-10T09:30:00Z',
    updatedAt: '2023-06-15T11:15:00Z'
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Emily Wilson',
    doctorId: '4',
    doctorName: 'Dr. Lisa Chen',
    date: '2023-06-16',
    time: '14:00',
    duration: 45,
    type: 'Follow-up',
    status: 'completed',
    symptoms: 'Follow-up for asthma management',
    notes: 'Patient responding well to new inhaler. Continue current treatment plan',
    createdAt: '2023-06-09T15:45:00Z',
    updatedAt: '2023-06-16T15:00:00Z'
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Michael Brown',
    doctorId: '1',
    doctorName: 'Dr. James Smith',
    date: '2023-06-20',
    time: '09:15',
    duration: 30,
    type: 'Check-up',
    status: 'scheduled',
    symptoms: 'Routine check-up for diabetes management',
    notes: '',
    createdAt: '2023-06-12T11:30:00Z',
    updatedAt: '2023-06-12T11:30:00Z'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'David Lee',
    doctorId: '3',
    doctorName: 'Dr. Robert Williams',
    date: '2023-06-18',
    time: '11:30',
    duration: 60,
    type: 'Follow-up',
    status: 'confirmed',
    symptoms: 'Follow-up for back pain management',
    notes: 'Bring previous MRI reports',
    createdAt: '2023-06-14T14:20:00Z',
    updatedAt: '2023-06-14T14:20:00Z'
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'Sophia Martinez',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    date: '2023-06-19',
    time: '15:45',
    duration: 30,
    type: 'Consultation',
    status: 'scheduled',
    symptoms: 'Migraines and sensitivity to light',
    notes: '',
    createdAt: '2023-06-15T09:10:00Z',
    updatedAt: '2023-06-15T09:10:00Z'
  },
  {
    id: '6',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '1',
    doctorName: 'Dr. James Smith',
    date: '2023-06-22',
    time: '10:00',
    duration: 45,
    type: 'Follow-up',
    status: 'scheduled',
    symptoms: 'Follow-up for hypertension treatment',
    notes: 'Review medication efficacy and side effects',
    createdAt: '2023-06-16T10:30:00Z',
    updatedAt: '2023-06-16T10:30:00Z'
  }
];

// Mock Medicines for pharmacy
export const mockMedicines = [
  {
    id: '1',
    name: 'Amoxicillin',
    description: 'Antibiotic used to treat bacterial infections',
    category: 'Antibiotics',
    manufacturer: 'MedPharma Inc.',
    price: 12.99,
    stock: 120,
    dosage: '500mg, 3 times daily',
    expiryDate: '2024-12-25',
    sideEffects: 'Nausea, vomiting, diarrhea',
    prescriptionRequired: true,
    createdAt: '2023-05-12T10:30:00Z',
    updatedAt: '2023-05-12T10:30:00Z'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    description: 'Nonsteroidal anti-inflammatory drug used for pain relief',
    category: 'Analgesics',
    manufacturer: 'HealthPharm',
    price: 8.50,
    stock: 200,
    dosage: '200mg, every 6 hours as needed',
    expiryDate: '2025-06-18',
    sideEffects: 'Stomach upset, drowsiness',
    prescriptionRequired: false,
    createdAt: '2023-04-10T14:45:00Z',
    updatedAt: '2023-04-10T14:45:00Z'
  },
  {
    id: '3',
    name: 'Lisinopril',
    description: 'Medication used to treat high blood pressure and heart failure',
    category: 'Antihypertensives',
    manufacturer: 'CardioMed Labs',
    price: 15.75,
    stock: 85,
    dosage: '10mg, once daily',
    expiryDate: '2024-09-30',
    sideEffects: 'Dizziness, cough, headache',
    prescriptionRequired: true,
    createdAt: '2023-03-22T09:15:00Z',
    updatedAt: '2023-03-22T09:15:00Z'
  },
  {
    id: '4',
    name: 'Cetirizine',
    description: 'Antihistamine used to relieve allergy symptoms',
    category: 'Antihistamines',
    manufacturer: 'AllergyStop',
    price: 9.99,
    stock: 150,
    dosage: '10mg, once daily',
    expiryDate: '2025-03-15',
    sideEffects: 'Drowsiness, dry mouth',
    prescriptionRequired: false,
    createdAt: '2023-06-05T11:20:00Z',
    updatedAt: '2023-06-05T11:20:00Z'
  },
  {
    id: '5',
    name: 'Metformin',
    description: 'Medication used to treat type 2 diabetes',
    category: 'Antidiabetics',
    manufacturer: 'DiabeCare',
    price: 14.25,
    stock: 95,
    dosage: '500mg, twice daily with meals',
    expiryDate: '2024-11-08',
    sideEffects: 'Nausea, diarrhea, stomach discomfort',
    prescriptionRequired: true,
    createdAt: '2023-05-18T16:40:00Z',
    updatedAt: '2023-05-18T16:40:00Z'
  },
  {
    id: '6',
    name: 'Atorvastatin',
    description: 'Statin medication used to prevent cardiovascular disease',
    category: 'Cardiovascular',
    manufacturer: 'HeartWell Pharma',
    price: 18.50,
    stock: 75,
    dosage: '20mg, once daily',
    expiryDate: '2024-10-12',
    sideEffects: 'Muscle pain, headache, digestive issues',
    prescriptionRequired: true,
    createdAt: '2023-04-30T13:10:00Z',
    updatedAt: '2023-04-30T13:10:00Z'
  },
  {
    id: '7',
    name: 'Vitamin D3',
    description: 'Supplement to support bone health and immune function',
    category: 'Nutritional Supplements',
    manufacturer: 'VitaHealth',
    price: 11.99,
    stock: 180,
    dosage: '1000 IU, once daily',
    expiryDate: '2025-08-22',
    sideEffects: 'None at recommended dosage',
    prescriptionRequired: false,
    createdAt: '2023-06-15T10:05:00Z',
    updatedAt: '2023-06-15T10:05:00Z'
  },
  {
    id: '8',
    name: 'Albuterol Inhaler',
    description: 'Bronchodilator used to treat asthma',
    category: 'Respiratory',
    manufacturer: 'RespiCare',
    price: 24.99,
    stock: 60,
    dosage: '2 inhalations every 4-6 hours as needed',
    expiryDate: '2024-07-14',
    sideEffects: 'Tremors, nervousness, headache',
    prescriptionRequired: true,
    createdAt: '2023-05-08T15:30:00Z',
    updatedAt: '2023-05-08T15:30:00Z'
  }
];

// Mock Lab Reports
export const mockLabReports = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    testType: 'Blood Test',
    testDate: '2023-06-15',
    reportDate: '2023-06-17',
    results: 'Hemoglobin: 14.5 g/dL\nRBC: 5.2 million/μL\nWBC: 7,500/μL\nPlatelets: 250,000/μL\nBlood Glucose (Fasting): 95 mg/dL',
    normalRanges: 'Hemoglobin: 13.5-17.5 g/dL\nRBC: 4.5-5.9 million/μL\nWBC: 4,500-11,000/μL\nPlatelets: 150,000-450,000/μL\nBlood Glucose (Fasting): 70-100 mg/dL',
    observations: 'All values within normal ranges. Patient appears to be in good health with no abnormalities detected in the blood parameters.',
    conclusion: 'Normal blood count and chemistry. No further testing required at this time.',
    status: 'completed',
    createdAt: '2023-06-15T09:30:00Z',
    updatedAt: '2023-06-17T14:20:00Z'
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Emily Wilson',
    doctorId: '1',
    doctorName: 'Dr. James Smith',
    testType: 'X-Ray',
    testDate: '2023-06-18',
    reportDate: '2023-06-19',
    results: 'Chest X-ray shows clear lung fields. Heart size appears normal. No evidence of pneumonia, effusion, or other acute process.',
    normalRanges: 'N/A',
    observations: 'Patient presented with mild cough and chest discomfort for 3 days. X-ray shows no signs of infection or abnormality.',
    conclusion: 'Normal chest X-ray. Symptoms likely due to viral upper respiratory infection.',
    status: 'completed',
    attachmentUrl: 'https://example.com/xray/patient3',
    createdAt: '2023-06-18T10:45:00Z',
    updatedAt: '2023-06-19T11:30:00Z'
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Michael Brown',
    doctorId: '4',
    doctorName: 'Dr. Lisa Chen',
    testType: 'Lipid Profile',
    testDate: '2023-06-20',
    reportDate: '2023-06-22',
    results: 'Total Cholesterol: 210 mg/dL\nLDL Cholesterol: 140 mg/dL\nHDL Cholesterol: 45 mg/dL\nTriglycerides: 150 mg/dL',
    normalRanges: 'Total Cholesterol: <200 mg/dL\nLDL Cholesterol: <100 mg/dL\nHDL Cholesterol: >40 mg/dL (men), >50 mg/dL (women)\nTriglycerides: <150 mg/dL',
    observations: 'Patient has elevated total cholesterol and LDL cholesterol levels. HDL cholesterol is within normal range. Triglycerides at upper limit of normal range.',
    conclusion: 'Mild hyperlipidemia. Dietary modifications recommended. Consider follow-up testing in 3 months.',
    status: 'completed',
    createdAt: '2023-06-20T08:15:00Z',
    updatedAt: '2023-06-22T15:40:00Z'
  },
  {
    id: '4',
    patientId: '5',
    patientName: 'Sophia Martinez',
    doctorId: '3',
    doctorName: 'Dr. Robert Williams',
    testType: 'Urine Test',
    testDate: '2023-06-25',
    reportDate: '2023-06-26',
    results: 'Color: Pale yellow\nClarity: Clear\npH: 6.0\nSpecific Gravity: 1.015\nGlucose: Negative\nProtein: Negative\nBlood: Negative\nLeukocyte Esterase: Negative\nNitrite: Negative',
    normalRanges: 'Color: Pale yellow to amber\nClarity: Clear\npH: 4.5-8.0\nSpecific Gravity: 1.005-1.030\nGlucose: Negative\nProtein: Negative\nBlood: Negative\nLeukocyte Esterase: Negative\nNitrite: Negative',
    observations: 'Routine urinalysis shows no evidence of infection or other abnormalities.',
    conclusion: 'Normal urinalysis results.',
    status: 'completed',
    createdAt: '2023-06-25T13:20:00Z',
    updatedAt: '2023-06-26T10:10:00Z'
  },
  {
    id: '5',
    patientId: '4',
    patientName: 'David Lee',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    testType: 'MRI',
    testDate: '2023-06-28',
    reportDate: '2023-06-30',
    results: 'MRI of the lumbar spine shows mild disc bulging at L4-L5 and L5-S1 levels without significant neural compression. No evidence of spinal stenosis or spondylolisthesis.',
    normalRanges: 'N/A',
    observations: 'Patient presented with lower back pain radiating to left leg. MRI shows mild degenerative changes consistent with age.',
    conclusion: 'Mild lumbar disc disease. Physical therapy recommended. No surgical intervention needed at this time.',
    status: 'completed',
    attachmentUrl: 'https://example.com/mri/patient4',
    createdAt: '2023-06-28T09:00:00Z',
    updatedAt: '2023-06-30T16:45:00Z'
  },
  {
    id: '6',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '1',
    doctorName: 'Dr. James Smith',
    testType: 'ECG',
    testDate: '2023-07-05',
    reportDate: null,
    results: '',
    normalRanges: 'Normal sinus rhythm: 60-100 bpm\nPR interval: 0.12-0.20 seconds\nQRS duration: 0.06-0.10 seconds\nQT interval: 0.35-0.44 seconds',
    observations: 'Test completed, awaiting interpretation by cardiologist.',
    conclusion: '',
    status: 'pending',
    createdAt: '2023-07-05T11:30:00Z',
    updatedAt: '2023-07-05T11:30:00Z'
  },
  {
    id: '7',
    patientId: '6',
    patientName: 'Jennifer Adams',
    doctorId: '3',
    doctorName: 'Dr. Robert Williams',
    testType: 'Thyroid Profile',
    testDate: '2023-07-08',
    reportDate: '2023-07-10',
    results: 'TSH: 4.8 μIU/mL\nT3: 110 ng/dL\nT4: 8.2 μg/dL\nFree T4: 1.1 ng/dL',
    normalRanges: 'TSH: 0.4-4.0 μIU/mL\nT3: 80-200 ng/dL\nT4: 5.0-12.0 μg/dL\nFree T4: 0.8-1.8 ng/dL',
    observations: 'Slightly elevated TSH with normal T3 and T4 levels, suggesting subclinical hypothyroidism.',
    conclusion: 'Subclinical hypothyroidism. Recommend follow-up testing in 3 months. No immediate treatment required.',
    status: 'completed',
    createdAt: '2023-07-08T14:15:00Z',
    updatedAt: '2023-07-10T09:50:00Z'
  },
  {
    id: '8',
    patientId: '5',
    patientName: 'Sophia Martinez',
    doctorId: '4',
    doctorName: 'Dr. Lisa Chen',
    testType: 'CT Scan',
    testDate: '2023-07-12',
    reportDate: null,
    results: '',
    normalRanges: 'N/A',
    observations: 'Abdominal CT scan performed due to recurrent abdominal pain. Images acquired, awaiting radiologist review.',
    conclusion: '',
    status: 'pending',
    createdAt: '2023-07-12T10:20:00Z',
    updatedAt: '2023-07-12T10:20:00Z'
  }
]; 
 