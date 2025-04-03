import React, { useEffect, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [platform, setPlatform] = useState('Instagram');

  useEffect(() => {
    fetch('http://localhost:5000/api/profiles')
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error('Error fetching profiles:', err));
  }, []);

  const filtered = profiles.filter((p) => p.platform === platform);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">OF Scraper Dashboard</h1>

      <div className="flex justify-center gap-4 mb-6">
        <Toggle pressed={platform === 'Instagram'} onPressedChange={() => setPlatform('Instagram')}>Instagram</Toggle>
        <Toggle pressed={platform === 'Twitter'} onPressedChange={() => setPlatform('Twitter')}>Twitter</Toggle>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-screen overflow-y-scroll p-4">
        {filtered.map((profile, index) => (
          <a
            key={index}
            href={profile.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl shadow p-4 border hover:shadow-lg transition duration-300"
          >
            <img
              src={profile.profile_img || 'https://via.placeholder.com/150'}
              alt="profile"
              className="w-full h-48 object-cover rounded-xl mb-2"
            />
            <p className="text-center text-sm text-gray-700 break-words">{profile.profile_url}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
