'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Instagram, Twitter, Star } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [platform, setPlatform] = useState('Instagram');
  const [isLoading, setIsLoading] = useState(true);
  const [starred, setStarred] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  const parseFollowers = (str) => {
    if (!str || typeof str !== 'string') return 0;
    const clean = str.toLowerCase().replace(/[^0-9.km]/g, '');
    if (clean.endsWith('k')) return parseFloat(clean) * 1_000;
    if (clean.endsWith('m')) return parseFloat(clean) * 1_000_000;
    return parseInt(clean.replace(/,/g, '')) || 0;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const agency = localStorage.getItem('agency');
    const token = localStorage.getItem('token');

    if (!agency || !token) {
      router.push('/login');
      return;
    }

    const fetchData = () => {
      fetch('https://backend-scraper-qkcr.onrender.com/api/profiles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProfiles(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching profiles:", err);
          setIsLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('starredProfiles') || '[]');
    setStarred(saved);
  }, []);

  const toggleStar = (url) => {
    const updated = starred.includes(url)
      ? starred.filter(u => u !== url)
      : [...starred, url];

    setStarred(updated);
    localStorage.setItem('starredProfiles', JSON.stringify(updated));
  };

  const displayed = profiles
    .filter((p) =>
      platform === 'Starred' ? starred.includes(p.profile_url) : p.platform === platform
    )
    .sort((a, b) => {
      const aCount = parseFollowers(a.followers);
      const bCount = parseFollowers(b.followers);
      return sortOrder === 'asc' ? aCount - bCount : bCount - aCount;
    });

  if (isLoading) {
    return <div className="text-center p-10 text-white">Loading dashboard...</div>;
  }

  const buttonStyles = (type) => {
    const base = `flex items-center gap-2 px-5 py-2.5 rounded-full border shadow transition duration-200 transform`;
    const active =
      type === 'Instagram'
        ? 'bg-pink-600 text-white'
        : type === 'Twitter'
        ? 'bg-blue-600 text-white'
        : 'bg-yellow-500 text-white';
    const hover =
      type === 'Instagram'
        ? 'hover:bg-pink-500'
        : type === 'Twitter'
        ? 'hover:bg-blue-500'
        : 'hover:bg-yellow-400';

    return `${base} ${
      platform === type
        ? active
        : `bg-zinc-800 text-gray-300 ${hover} hover:text-white hover:scale-105`
    }`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">OF Recruitement Dashboard</h1>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <div className="mt-1">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-zinc-800 text-white border border-zinc-700 px-4 py-2 rounded"
          >
            <option value="desc">Sort: Followers ↓</option>
            <option value="asc">Sort: Followers ↑</option>
          </select>
        </div>

        <button className={buttonStyles('Instagram')} onClick={() => setPlatform('Instagram')}>
          <Instagram size={18} /> Instagram
        </button>

        <button className={buttonStyles('Twitter')} onClick={() => setPlatform('Twitter')}>
          <Twitter size={18} /> Twitter
        </button>

        <button className={buttonStyles('Starred')} onClick={() => setPlatform('Starred')}>
          <Star size={18} /> Starred
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-screen overflow-y-scroll p-4">
        {displayed.map((profile, index) => (
          <a
            key={index}
            href={profile.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-2xl shadow p-4 border hover:shadow-lg transition duration-300 bg-zinc-900 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={profile.profile_img || 'https://via.placeholder.com/150'}
              alt="profile"
              className="w-full h-[320px] object-contain rounded-xl mb-3 border border-zinc-700 bg-black"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />

            <p className="text-center text-sm text-gray-300 break-words mb-1">
              {profile.profile_url}
            </p>

            {profile.followers && (
              <p className="text-center text-lg font-bold text-blue-300">
                👥 <span className="text-white">{profile.followers}</span>
              </p>
            )}

            <div
              onClick={(e) => {
                e.preventDefault();
                toggleStar(profile.profile_url);
              }}
              className={`absolute bottom-3 right-3 text-2xl cursor-pointer transition-colors duration-200 ${
                starred.includes(profile.profile_url)
                  ? 'text-yellow-400 hover:text-yellow-300'
                  : 'text-gray-200 hover:text-yellow-300'
              }`}
              style={{
                textShadow: !starred.includes(profile.profile_url)
                  ? '0 0 3px black, 0 0 6px black'
                  : 'none',
              }}
            >
              {starred.includes(profile.profile_url) ? '⭐' : '☆'}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
