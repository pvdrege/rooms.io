import React, { useState, useEffect } from 'react';
import { discoveryAPI, hashtagsAPI } from '../../lib/api';
import { Profile, Hashtag } from '../../types';
import toast from 'react-hot-toast';

export default function DiscoveryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    hashtags: [] as string[],
    location: '',
    search: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profilesRes, hashtagsRes] = await Promise.all([
        discoveryAPI.getProfiles(),
        hashtagsAPI.getAll(),
      ]);
      
      setProfiles(profilesRes.data.data || []);
      setHashtags(hashtagsRes.data.data || []);
    } catch (error: any) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleHashtagToggle = (hashtagName: string) => {
    setFilters(prev => ({
      ...prev,
      hashtags: prev.hashtags.includes(hashtagName)
        ? prev.hashtags.filter(h => h !== hashtagName)
        : [...prev.hashtags, hashtagName],
    }));
  };

  const filteredProfiles = profiles.filter(profile => {
    if (filters.search && !profile.user.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.location && profile.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.hashtags.length > 0) {
      const profileHashtags = profile.hashtags.map(h => h.name);
      return filters.hashtags.some(h => profileHashtags.includes(h));
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Profilleri Keşfet</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İsim Ara
              </label>
              <input
                type="text"
                placeholder="İsim ile ara..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konum
              </label>
              <input
                type="text"
                placeholder="Konum ara..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtagler
              </label>
              <div className="flex flex-wrap gap-2">
                {hashtags.slice(0, 5).map((hashtag) => (
                  <button
                    key={hashtag.id}
                    onClick={() => handleHashtagToggle(hashtag.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.hashtags.includes(hashtag.name)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hashtag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-xl">
                    {profile.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.user.name}
                </h3>
                {profile.location && (
                  <p className="text-sm text-gray-500">{profile.location}</p>
                )}
              </div>
            </div>

            {profile.bio && (
              <p className="text-gray-600 mb-4 line-clamp-3">{profile.bio}</p>
            )}

            {profile.hashtags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {profile.hashtags.slice(0, 3).map((hashtag) => (
                    <span
                      key={hashtag.id}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                    >
                      {hashtag.name}
                    </span>
                  ))}
                  {profile.hashtags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                      +{profile.hashtags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
              Bağlantı İsteği Gönder
            </button>
          </div>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Arama kriterlerinize uygun profil bulunamadı.</p>
        </div>
      )}
    </div>
  );
} 