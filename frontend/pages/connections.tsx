import React, { useState, useEffect } from 'react';
import { connectionsAPI } from '../src/lib/api';
import { Connection } from '../src/types';
import { Toaster, toast } from 'react-hot-toast';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await connectionsAPI.getConnections();
      setConnections(response.data.data || []);
    } catch (error: any) {
      toast.error('Bağlantılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (id: string, status: 'accepted' | 'declined') => {
    try {
      await connectionsAPI.updateRequest(id, status);
      toast.success(`Bağlantı isteği ${status === 'accepted' ? 'kabul edildi' : 'reddedildi'}`);
      loadConnections(); // Reload connections
    } catch (error: any) {
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  if (loading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bağlantılarım</h1>

        {connections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz bağlantınız bulunmuyor.</p>
            <p className="text-gray-400 text-sm mt-2">
              Keşfet sayfasından yeni bağlantılar bulabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">
                        {connection.requester.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {connection.requester.name}
                      </h3>
                      <p className="text-sm text-gray-500">{connection.requester.email}</p>
                      {connection.message && (
                        <p className="text-sm text-gray-600 mt-1">{connection.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {connection.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequestAction(connection.id, 'accepted')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Kabul Et
                      </button>
                      <button
                        onClick={() => handleRequestAction(connection.id, 'declined')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                  
                  {connection.status === 'accepted' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Bağlantı Kuruldu
                    </span>
                  )}
                  
                  {connection.status === 'declined' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      Reddedildi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 