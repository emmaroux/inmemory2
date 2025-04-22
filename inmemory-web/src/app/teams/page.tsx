'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Team {
  id: number;
  attributes: {
    name: string;
    color: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  };
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/teams?populate=*`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des équipes');
        }

        const data = await response.json();
        setTeams(data.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [router]);

  const handleTeamAction = async (teamId: number, action: 'join' | 'leave') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const endpoint = action === 'join' 
        ? `/api/team-memberships` 
        : `/api/team-memberships/${teamId}`;
      
      const method = action === 'join' ? 'POST' : 'DELETE';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...(action === 'join' && {
          body: JSON.stringify({
            data: {
              team: teamId,
              status: 'PENDING'
            }
          })
        })
      });

      if (response.ok) {
        // Recharger les équipes
        const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/teams?populate=*`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await updatedResponse.json();
        setTeams(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes équipes</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{team.attributes.name}</h2>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: team.attributes.color }}
              />
            </div>

            <div className="mt-4">
              {team.attributes.status ? (
                team.attributes.status === 'PENDING' ? (
                  <p className="text-sm text-yellow-600">Demande en attente</p>
                ) : team.attributes.status === 'APPROVED' ? (
                  <button
                    onClick={() => handleTeamAction(team.id, 'leave')}
                    className="w-full px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Quitter l'équipe
                  </button>
                ) : null
              ) : (
                <button
                  onClick={() => handleTeamAction(team.id, 'join')}
                  className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Rejoindre l'équipe
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 