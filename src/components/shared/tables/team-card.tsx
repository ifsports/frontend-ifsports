import React from 'react';
import type { ActionButtonProps } from './action-button';
import TeamHeader from './team-header';
import type { Team } from '@/types/team';

export interface TeamCardProps {
  team: Team;
  isExpanded: boolean;
  onToggle: () => void;
  actions?: ActionButtonProps[];
  children?: React.ReactNode;
  showToggle?: boolean;
}

export default function TeamCard({ team, isExpanded, onToggle, actions = [], children,showToggle = true }: TeamCardProps) {
  return (
    <div className="border border-gray-300 rounded-2xl p-2 pl-3 pr-5 my-8 w-full">
      <TeamHeader 
        team={team}
        actions={actions}
        isExpanded={isExpanded}
        onToggle={onToggle}
        showToggle={showToggle}
      />
      {isExpanded && children}
    </div>
  );
};