import React, { useState, useEffect } from 'react';
import { profileAPI, hashtagsAPI } from '../../lib/api';
import { Profile, Hashtag } from '../../types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    hashtags: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, hashtagsRes] = await Promise.all([
        profileAPI.getMe(),
        hashtagsAPI.getAll(),
      ]);
      
      setProfile(profileRes.data.data);
      setHashtags(hashtagsRes.data.data || []);
      
      if (profileRes.data.data) {
        setFormData({
          bio: profileRes.data.data.bio || '',
          location: profileRes.data.data.location || '',
          website: profileRes.data.data.website || '',
          hashtags: profileRes.data.data.hashtags.map((h: Hashtag) => h.name),
        });
      }
    } catch (error: any) {
      toast.error('Profil yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await profileAPI.updateProfile(formData);
      setProfile(response.data.data);
      setEditing(false);
      toast.success('Profil başarıyla güncellendi!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profil güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHashtagToggle = (hashtagName: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.includes(hashtagName)
        ? prev.hashtags.filter(h => h !== hashtagName)
        : [...prev.hashtags, hashtagName],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Profil bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-2xl">
                    {profile.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{profile.user.name}</h1>
                <p className="text-gray-500">{profile.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {editing ? 'İptal' : 'Düzenle'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hakkımda
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Kendiniz hakkında kısa bir açıklama..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Şehir, Ülke"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlgi Alanları (Hashtagler)
                </label>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag) => (
                    <button
                      key={hashtag.id}
                      type="button"
                      onClick={() => handleHashtagToggle(hashtag.name)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.hashtags.includes(hashtag.name)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {hashtag.name}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Seçilen: {formData.hashtags.length} hashtag
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Hakkımda</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {/* Location */}
              {profile.location && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Konum</h3>
                  <p className="text-gray-600">{profile.location}</p>
                </div>
              )}

              {/* Website */}
              {profile.website && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Website</h3>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              {/* Hashtags */}
              {profile.hashtags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">İlgi Alanları</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.hashtags.map((hashtag) => (
                      <span
                        key={hashtag.id}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                      >
                        {hashtag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 