import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import '../css/ReceptionistDashboard.css'

const ReceptionistDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [billingInputs, setBillingInputs] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch patient list
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patientList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientList);
      } catch (error) {
        console.error('❌ Failed to fetch patients:', error.message);
        alert('Failed to fetch patient data.');
      }
    };
    fetchPatients();
  }, []);

  // Handle input change
  const handleInputChange = (id, value) => {
    setBillingInputs({
      ...billingInputs,
      [id]: value,
    });
  };

  // Handle update billing
  const handleUpdateBilling = async (id) => {
    const amount = billingInputs[id];
    if (!amount || isNaN(amount)) {
      alert('⚠️ Please enter a valid billing amount.');
      return;
    }

    try {
      const patientRef = doc(db, 'patients', id);
      await updateDoc(patientRef, { billingAmount: parseFloat(amount) });
      alert(`✅ Billing amount updated for patient!`);
      setBillingInputs({ ...billingInputs, [id]: '' });
    } catch (error) {
      console.error('❌ Failed to update billing amount:', error.message);
      alert('Failed to update billing amount: ' + error.message);
    }
  };

  // Handle logout
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
    <div className="receptionist-dashboard">
      <h2>🧾 Receptionist Dashboard</h2>

      {/* Billing Table */}
      <table className="billing-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Prescription</th>
            <th>Billing Amount (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.prescription}</td>
              <td>
                <input
                  type="number"
                  value={billingInputs[patient.id] || ''}
                  onChange={(e) => handleInputChange(patient.id, e.target.value)}
                  placeholder="Enter amount"
                />
              </td>
              <td>
                <button className="update-btn" onClick={() => handleUpdateBilling(patient.id)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="button-container">
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
        <button className="dashboard-button">
          <Link to="/main-dashboard" className="dashboard-link">📊 Dashboard</Link>
        </button>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;

/* CSS */

