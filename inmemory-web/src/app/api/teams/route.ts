import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('Utilisateur non trouvé', { status: 404 });
    }

    // Récupérer toutes les équipes avec le statut de l'utilisateur courant
    const teams = await prisma.team.findMany({
      include: {
        members: {
          where: { userId: user.id },
          select: { status: true },
        },
      },
    });

    // Formater les données pour le client
    const formattedTeams = teams.map(team => ({
      ...team,
      userTeam: team.members[0],
      members: undefined, // Ne pas envoyer la liste complète des membres
    }));

    return NextResponse.json(formattedTeams);
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
} 