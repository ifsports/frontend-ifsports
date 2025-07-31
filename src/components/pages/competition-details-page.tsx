"use client";

import type { Competition, GroupData, RoundData } from '@/types/competition';
import type { Team, TeamMember } from '@/types/team';
import { populateCompetitionStages } from '@/utils/competitions';
import OrganizerPointsCompetition from './organizer-points-competition';
import OrganizerGroupStageCompetition from './organizer-group-stage';
import OrganizerKnockoutCompetition from './organizer-knockout-competition';

interface CompetitionPageProps {
  competitionId: string;
}

const apiCompetitionData: Competition = {
  id: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
  name: "Futsal Masculino",
  modality: { id: "7d8e3664-e43f-4532-a7b6-5a11b4a2608e", name: "Futsal", campus: "IFG" },
  status: 'in-progress',
  start_date: "2025-07-29",
  end_date: "2025-08-15",
  system: 'league',
  image: "/media/competitions/basquete.png",
  min_members_per_team: 1,
  teams_per_group: 4,
  teams_qualified_per_group: 2
};

const teamMembers: TeamMember[] = [
  { user_id: "uuid-member" },
  { user_id: "outro-uuid" }
];

const teamFalcons: Team = { id: "team-falcons-id", name: "Falcons", abbreviation: "FAL", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers };
const teamEagles: Team = { id: "team-eagles-id", name: "Eagles", abbreviation: "EAG", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamLions: Team = { id: "team-lions-id", name: "Lions", abbreviation: "LIO", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamTigers: Team = { id: "team-tigers-id", name: "Tigers", abbreviation: "TIG", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamInformatica: Team = { id: "team-info-id", name: "INFORMÁTICA", abbreviation: "INF", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamAds: Team = { id: "team-ads-id", name: "ADS FC", abbreviation: "ADS", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };

const teamPanthers: Team = { id: "team-panthers-id", name: "Panthers", abbreviation: "PAN", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamWolves: Team = { id: "team-wolves-id", name: "Wolves", abbreviation: "WOL", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamBears: Team = { id: "team-bears-id", name: "Bears", abbreviation: "BEA", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };
const teamSharks: Team = { id: "team-sharks-id", name: "Sharks", abbreviation: "SHA", created_at: "2025-07-29 10:30:00.123456", status: "active", campus_code: "PF", members: teamMembers  };

const groupsData: GroupData[] = [
  {
    id: "group-a-id",
    name: "A",
    classifications: [
      { id: "class-falcons-id", team: teamFalcons, position: 1, points: 9, games_played: 3, wins: 3, draws: 0, losses: 0, score_pro: 8, score_against: 2, score_difference: 6 },
      { id: "class-eagles-id", team: teamEagles, position: 2, points: 4, games_played: 3, wins: 1, draws: 1, losses: 1, score_pro: 4, score_against: 4, score_difference: 0 },
      { id: "class-informatica-id", team: teamInformatica, position: 3, points: 2, games_played: 3, wins: 0, draws: 2, losses: 1, score_pro: 4, score_against: 7, score_difference: -3 },
      { id: "class-ads-id", team: teamAds, position: 4, points: 1, games_played: 3, wins: 0, draws: 1, losses: 2, score_pro: 2, score_against: 6, score_difference: -4 },
    ],
    rounds: [
      {
        id: "group-a-round-1-id",
        name: "1ª Rodada",
        matches: [
          {
            id: "match-a11-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-22T19:00:00Z",
            team_home: { team_id: teamInformatica.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamAds.id, competition: apiCompetitionData.id },
            score_home: 2,
            score_away: 2,
            winner: null,
            round_match_number: 1
          },
          {
            id: "match-a12-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-22T20:30:00Z",
            team_home: { team_id: teamFalcons.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamEagles.id, competition: apiCompetitionData.id },
            score_home: 3,
            score_away: 1,
            winner: teamFalcons.id,
            round_match_number: 2
          },
        ],
      },
      {
        id: "group-a-round-2-id",
        name: "2ª Rodada",
        matches: [
          {
            id: "match-a21-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-25T19:00:00Z",
            team_home: { team_id: teamAds.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamFalcons.id, competition: apiCompetitionData.id },
            score_home: 0,
            score_away: 2,
            winner: teamFalcons.id,
            round_match_number: 1
          },
          {
            id: "match-a22-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-25T20:30:00Z",
            team_home: { team_id: teamInformatica.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamEagles.id, competition: apiCompetitionData.id },
            score_home: 1,
            score_away: 1,
            winner: null,
            round_match_number: 2
          },
        ],
      },
      {
        id: "group-a-round-3-id",
        name: "3ª Rodada",
        matches: [
          {
            id: "match-a31-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-28T19:00:00Z",
            team_home: { team_id: teamEagles.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamAds.id, competition: apiCompetitionData.id },
            score_home: 2,
            score_away: 0,
            winner: teamEagles.id,
            round_match_number: 1
          },
          {
            id: "match-a32-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-28T20:30:00Z",
            team_home: { team_id: teamFalcons.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamInformatica.id, competition: apiCompetitionData.id },
            score_home: 4,
            score_away: 1,
            winner: teamFalcons.id,
            round_match_number: 2
          },
        ],
      },
    ],
  },
  {
    id: "group-b-id",
    name: "B",
    classifications: [
      { id: "class-panthers-id", team: teamPanthers, position: 1, points: 7, games_played: 3, wins: 2, draws: 1, losses: 0, score_pro: 6, score_against: 4, score_difference: 2 },
      { id: "class-bears-id", team: teamBears, position: 2, points: 4, games_played: 3, wins: 1, draws: 1, losses: 1, score_pro: 3, score_against: 3, score_difference: 0 },
      { id: "class-wolves-id", team: teamWolves, position: 3, points: 3, games_played: 3, wins: 0, draws: 3, losses: 0, score_pro: 4, score_against: 4, score_difference: 0 },
      { id: "class-sharks-id", team: teamSharks, position: 4, points: 1, games_played: 3, wins: 0, draws: 1, losses: 2, score_pro: 2, score_against: 4, score_difference: -2 },
    ],
    rounds: [
      {
        id: "group-b-round-1-id",
        name: "1ª Rodada",
        matches: [
          {
            id: "match-b11-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-23T19:00:00Z",
            team_home: { team_id: teamPanthers.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamSharks.id, competition: apiCompetitionData.id },
            score_home: 2,
            score_away: 1,
            winner: teamPanthers.id,
            round_match_number: 1
          },
          {
            id: "match-b12-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-23T20:30:00Z",
            team_home: { team_id: teamWolves.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamBears.id, competition: apiCompetitionData.id },
            score_home: 1,
            score_away: 1,
            winner: null,
            round_match_number: 2
          },
        ],
      },
      {
        id: "group-b-round-2-id",
        name: "2ª Rodada",
        matches: [
          {
            id: "match-b21-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-26T19:00:00Z",
            team_home: { team_id: teamBears.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamPanthers.id, competition: apiCompetitionData.id },
            score_home: 1,
            score_away: 2,
            winner: teamPanthers.id,
            round_match_number: 1
          },
          {
            id: "match-b22-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-26T20:30:00Z",
            team_home: { team_id: teamSharks.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamWolves.id, competition: apiCompetitionData.id },
            score_home: 1,
            score_away: 1,
            winner: null,
            round_match_number: 2
          },
        ],
      },
      {
        id: "group-b-round-3-id",
        name: "3ª Rodada",
        matches: [
          {
            id: "match-b31-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-29T19:00:00Z",
            team_home: { team_id: teamWolves.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamPanthers.id, competition: apiCompetitionData.id },
            score_home: 2,
            score_away: 2,
            winner: null,
            round_match_number: 1
          },
          {
            id: "match-b32-id",
            competition: apiCompetitionData.id,
            status: "finished",
            scheduled_datetime: "2025-07-29T20:30:00Z",
            team_home: { team_id: teamSharks.id, competition: apiCompetitionData.id },
            team_away: { team_id: teamBears.id, competition: apiCompetitionData.id },
            score_home: 0,
            score_away: 1,
            winner: teamBears.id,
            round_match_number: 2
          },
        ],
      },
    ],
  },
];

const competitionData = populateCompetitionStages(apiCompetitionData, { 
  numberOfGroups: groupsData.length 
});

export default function CompetitionDetailsPage({ competitionId }: CompetitionPageProps) {
  const allTeams = Array.from(
    new Map(
      groupsData.flatMap(group => 
        group.classifications.map(c => [c.team.id, c.team])
      )
    ).values()
  );

  const knockoutRoundsData: RoundData[] = [
    {
      id: "semifinal-id",
      name: "SEMIFINAL",
      matches: [
        {
          id: "sf-match-1",
          competition: competitionData.id,
          status: 'not-started',
          scheduled_datetime: "2025-08-02T19:00:00Z",
          team_home: { team_id: teamFalcons.id, competition: competitionData.id },
          team_away: { team_id: teamBears.id, competition: competitionData.id },
          round_match_number: 1
        },
        {
          id: "sf-match-2",
          competition: competitionData.id,
          status: 'not-started',
          scheduled_datetime: "2025-08-02T20:30:00Z",
          team_home: { team_id: teamPanthers.id, competition: competitionData.id },
          team_away: { team_id: teamEagles.id, competition: competitionData.id },
          round_match_number: 2
        },
      ]
    },
    {
      id: "final-id",
      name: "FINAL",
      matches: [
        {
          id: "final-match-1",
          competition: competitionData.id,
          status: 'not-started',
          scheduled_datetime: "2025-08-10T10:00:00Z",
          team_home: null,
          team_away: null,
          home_feeder_match: "sf-match-1",
          away_feeder_match: "sf-match-2",
          round_match_number: 1
        },
      ]
    }
  ];

  const renderCompetitionType = () => {
    switch (competitionData.system) {
      case "groups_elimination":
        return (
          <OrganizerGroupStageCompetition 
            competition={competitionData} 
            groups={groupsData}
            teams={allTeams} 
            knockoutRounds={knockoutRoundsData}
          />
        );

      case "elimination":
        return <OrganizerKnockoutCompetition competition={competitionData} teams={allTeams} rounds={knockoutRoundsData} />;
      
      case "league":
        return <OrganizerPointsCompetition competition={competitionData} groups={groupsData}  />;
      
      default:
        return <div>Tipo de competição não suportado</div>;
    }
  };

  return (
    <div>
      {renderCompetitionType()}
    </div>
  );
}