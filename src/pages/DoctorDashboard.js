import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate ,Link} from 'react-router-dom';
import '../css/DoctorDashboard.css'

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [prescription, setPrescription] = useState('');
  const navigate = useNavigate();

  // Fetch existing patients
  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, 'patients'));
      const patientList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPatients(patientList);
    };
    fetchPatients();
  }, []);

  // Handle adding patient with text-based prescription
  const handleSubmit = async () => {
    if (!name || !prescription) {
      alert('⚠️ Please enter patient name and prescription!');
      return;
    }

    const token = Math.floor(1000 + Math.random() * 9000);

    try {
      // Add patient info with text-based prescription
      await addDoc(collection(db, 'patients'), {
        name,
        prescription,
        token,
        createdAt: new Date(),
      });

      alert('✅ Patient added successfully with prescription!');
      setName('');
      setPrescription('');
    } catch (error) {
      alert('❌ Failed to add patient: ' + error.message);
    }
  };

  // Handle logout
  const auth = getAuth();

const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/');
    alert('✅ Successfully logged out!');
  } catch (error) {
    alert('❌ Failed to log out: ' + error.message);
  }
};


  return (
    <div className="doctor-dashboard">
      <h2>🩺 Doctor Dashboard</h2>

      {/* Input for Patient Name */}
      <input
        type="text"
        placeholder="Patient Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Input for Prescription */}
      <textarea
        placeholder="Enter prescription"
        value={prescription}
        onChange={(e) => setPrescription(e.target.value)}
      ></textarea>

      {/* Button to add patient */}
      <button onClick={handleSubmit}>Add Patient & Prescription</button>
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      <button><Link to="/main-dashboard">Dashboard</Link></button>

      {/* Display Patient List */}
      <h3>📝 Patient List</h3>
      <table className="patient-table">
            <thead>
                <tr>
                    <th>PATIENT NAME</th>
                    <th>TOKEN</th>
                    <th>PRESCRIPTION</th>
                </tr>
            </thead>
            <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.token}</td>
                    <td>{patient.prescription}</td>
                  </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default DoctorDashboard;