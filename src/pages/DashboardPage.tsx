import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    skills: [] as string[],
    experience: '',
    photo_url: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  // Fetch profile data on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
      toast.error('Failed to load profile: ' + error.message);
    } else if (data) {
      setProfile(data);
    } else {
      // If no profile exists, set defaults from auth
      setProfile({
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
        skills: [],
        experience: '',
        photo_url: user?.user_metadata?.avatar_url || '',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: profile.name,
        email: profile.email,
        skills: profile.skills,
        experience: profile.experience,
        photo_url: profile.photo_url,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast.error('Failed to save profile: ' + error.message);
    } else {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please log in to view your dashboard.</div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Dashboard</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-600" /> Your Profile
            </h2>
            {!isEditing ? (
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Photo */}
            <div className="flex items-center space-x-4">
              <img
                src={profile.photo_url || 'https://via.placeholder.com/100?text=Profile'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <Input
                  type="text"
                  placeholder="Photo URL"
                  value={profile.photo_url}
                  onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                  className="w-full max-w-md"
                />
              )}
            </div>

            {/* Name */}
            <div>
              <label className="text-gray-700 font-medium">Name</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-900 mt-1">{profile.name || 'Not set'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 font-medium">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-900 mt-1">{profile.email}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="text-gray-700 font-medium">Skills</label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                    />
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                      >
                        {skill}
                        <X
                          className="h-4 w-4 ml-2 cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 mt-1">
                  {profile.skills.length > 0 ? profile.skills.join(', ') : 'No skills added'}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="text-gray-700 font-medium">Experience</label>
              {isEditing ? (
                <textarea
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe your experience..."
                />
              ) : (
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {profile.experience || 'No experience added'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <Link to="/">
          <Button variant="outline" className="mt-4">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}