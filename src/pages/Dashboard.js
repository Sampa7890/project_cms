import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';


const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [prescription, setPrescription] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, 'patients'));
      const patientList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPatients(patientList);
    };
    fetchPatients();
  }, []);

  const addPatient = async () => {
    if (!name || !prescription) {
      alert('Please enter patient details');
      return;
    }
    const token = Math.floor(1000 + Math.random() * 9000);
    await addDoc(collection(db, 'patients'), {
      name,
      prescription,
      token,
      createdAt: new Date(),
    });
    alert('Patient added successfully!');
    setName('');
    setPrescription('');
  };

  return (
    <div>
      <h2>Clinic/Main Dashboard</h2>
      <input type='text' placeholder='Patient Name' value={name} onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder='Prescription' value={prescription} onChange={(e) => setPrescription(e.target.value)} />
      <button onClick={addPatient}>Add Patient</button>

      <h3>Patient List</h3>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.name} - Token: {patient.token} - Prescription: {patient.prescription}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;