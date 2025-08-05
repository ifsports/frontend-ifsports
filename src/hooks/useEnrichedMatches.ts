import { useState, useEffect, useMemo } from 'react';
import { getCompetitionsMatch } from '@/lib/requests/competitions';

export function useEnrichedMatches(matches: any[]) {
  const [enrichedMatches, setEnrichedMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const stableMatches = useMemo(() => {
    console.log('🔄 useMemo - matches recebidos:', matches);
    return matches;
  }, [JSON.stringify(matches)]);

  useEffect(() => {
    const enrichMatches = async () => {
      
      if (!stableMatches || stableMatches.length === 0) {
        setEnrichedMatches([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const promises = stableMatches.map(async (match) => {
          try {
            const details = await getCompetitionsMatch(match.match_id);
            
            if (details.success) {
              const hasSchedule = !!details.data?.scheduled_datetime;

              return {
                ...match,
                scheduled_datetime: details.data?.scheduled_datetime,
                hasSchedule: hasSchedule,
              };
            } else {
              return { ...match, hasSchedule: false };
            }
          } catch (error) {
            return { ...match, hasSchedule: false };
          }
        });

        const results = await Promise.all(promises);
        
        setEnrichedMatches(results);
      } catch (error) {
        setEnrichedMatches(stableMatches.map(m => ({ ...m, hasSchedule: false })));
      } finally {
        setIsLoading(false);
      }
    };

    enrichMatches();
  }, [stableMatches]);

  return { enrichedMatches, isLoading };
}