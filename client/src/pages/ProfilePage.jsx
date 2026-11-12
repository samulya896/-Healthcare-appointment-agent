import PersonalDetails from '../components/profile/PersonalDetails.jsx';
import ListSection from '../components/profile/ListSection.jsx';
import Avatar from '../components/common/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <div className="profile-hero card">
        <Avatar name={user.name} size="lg" />
        <div>
          <h1>{user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>
      </div>
      <div className="stack" style={{ marginTop: 20 }}>
        <PersonalDetails />
        <div className="profile-grid">
          <ListSection title="Medical history" icon="file" field="pastMedicalHistory"
            placeholder="Add a condition or surgery" emptyText="No medical history recorded." />
          <ListSection title="Allergies" icon="alert" field="allergies"
            placeholder="Add an allergy" emptyText="No known allergies recorded." />
          <ListSection title="Current medications" icon="pill" field="currentMedications"
            placeholder="Add a medication and dose" emptyText="No current medications recorded." />
          <ListSection title="Current symptoms" icon="activity" field="commonSymptoms"
            placeholder="Describe a symptom" emptyText="No current symptoms recorded." />
        </div>
      </div>
    </>
  );
}
