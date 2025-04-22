import { Resource, Team, Vote, Comment } from '@/app/types';
import Image from 'next/image';

interface ResourceCardProps {
  resource: Resource;
  teams: Team[];
  votes: { [teamId: string]: Vote[] };
  comments: Comment[];
}

export default function ResourceCard({ resource, teams, votes, comments }: ResourceCardProps) {
  // Fonction pour trouver l'équipe correspondant à un teamId
  const getTeamById = (teamId: string): Team | undefined => {
    return teams.find(team => team.id === teamId);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
      {/* En-tête de la ressource */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
        {resource.imageUrl && (
          <div className="relative h-48 mb-4">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-gray-600">{resource.description}</p>
        <a href={resource.link} 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-blue-500 hover:underline">
          Voir la ressource
        </a>
      </div>

      {/* Section des votes par équipe */}
      <div className="border-t p-4">
        <h4 className="font-semibold mb-2">Votes par équipe :</h4>
        <div className="flex flex-wrap gap-2">
          {teams.map(team => {
            const teamVotes = votes[team.id] || [];
            const voteCount = teamVotes.length;
            return (
              <div
                key={team.id}
                className="flex items-center px-3 py-1 rounded-full"
                style={{ backgroundColor: `${team.color}20` }}
              >
                <span style={{ color: team.color }}>{team.name}: </span>
                <span className="ml-1 font-bold">{voteCount}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section des commentaires */}
      <div className="border-t p-4">
        <h4 className="font-semibold mb-2">Commentaires :</h4>
        <div className="space-y-2">
          {comments.map(comment => {
            const team = getTeamById(comment.teamId);
            return (
              <div
                key={comment.id}
                className="p-2 rounded"
                style={{ backgroundColor: team ? `${team.color}10` : '#f0f0f0' }}
              >
                <div className="flex items-center gap-2">
                  {team && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: team.color, color: 'white' }}
                    >
                      {team.name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-700">{comment.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 