"use client"

import {useEffect, useMemo, useState} from 'react';
import {Clock, MapPin, Users, Trophy, Volleyball, NotebookTabs, Search} from 'lucide-react';
import Image from "next/image";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import bannerImg from "@/assets/banner-img.png"
import CompetitionsFilter from "@/components/shared/competitions-filter";
import {campusData} from "@/lib/campus";
import {Button} from "@/components/ui/button";
import { useCompetitions } from '@/hooks/useCompetitions';
import type { Competition } from '@/types/competition';
import Link from 'next/link';
import CompetitionCard from '../shared/competition-card';
import { useMatchesToday } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import dayjs from "dayjs";
import { useCampusCode } from '@/hooks/useCampusCode';

export default function HomePage(){
  const [campus, setCampus] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [isCampusSelected, setIsCampusSelected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const campusSelect = useCampusCode();

    useEffect(() => {
        if (!campusSelect) return;
        setCampus(campusSelect);
        setSelectedCampus(campusSelect);
        setIsCampusSelected(true);
    }, [campusSelect])

  const {data: competitions, isLoading: isLoadingCompetitions} = useCompetitions(isCampusSelected, selectedCampus);

  const {data: matchesToday, isLoading: isLoadingMatchesToday} = useMatchesToday(selectedCampus)

  const { data: teams, isLoading: isLoadingTeams } = useTeams(selectedCampus);
  
  const teamPairs = useMemo(() => {
    if (!teams || !matchesToday) return [];

    return matchesToday.map((match) => {
        const homeTeam = teams.find((t) => t.id === match.team_home?.team_id);
        const awayTeam = teams.find((t) => t.id === match.team_away?.team_id);
        const competition = competitions?.find(c => c.id === match.competition);
        return {
            matchId: match.id,
            homeTeam,
            awayTeam,
            competition,
        };
    });
  }, [teams, matchesToday, competitions]);

  const groupCompetitions = (competitions: Competition[] | undefined, itemsPerSlide: number) => {
      if (!competitions || competitions.length === 0) {
          return [];
      }

      const groups = [];
      for (let i = 0; i < competitions.length; i += itemsPerSlide) {
          groups.push(competitions.slice(i, i + itemsPerSlide));
      }
      return groups;
  };

  useEffect(() => {
      const checkScreenSize = () => {
          setIsMobile(window.innerWidth < 768);
          setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const itemsPerSlide = isMobile ? 1 : isTablet ? 2 : 3;
  const groupedCompetitions = groupCompetitions(competitions, itemsPerSlide);

  return (
      <div className="my-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                      <h1 className="font-bold text-5xl leading-tight text-[#062601] mb-4 font-title">
                          No Intercurso, cada jogo é a chance de fazer história!
                      </h1>
                      <p className="text-justify mb-8 text-xl text-[#4F4F4F]">
                          O campeonato que promove a integração e a competitividade entre os alunos
                          do campus. Com uma variedade de modalidades esportivas, o evento
                          proporciona momentos de superação e diversão, fortalecendo o laço entre as
                          turmas enquanto todos competem pelo título. Venha participar e celebrar o
                          esporte no IFPDF!
                      </p>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                      <div className="flex items-center gap-3">
                          <div className="bg-[#4CAF50] w-8 h-8 rounded-full flex items-center justify-center">
                              <Users className="text-white" size={18} />
                          </div>
                          <p>Espírito de equipe</p>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="bg-[#147A02] w-8 h-8 rounded-full flex items-center justify-center">
                              <NotebookTabs className="text-white" size={18} />
                          </div>
                          <p>Integração entre os cursos</p>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="bg-[#147A02] w-8 h-8 rounded-full flex items-center justify-center">
                              <Trophy className="text-white" size={18} />
                          </div>
                          <p>Competitividade saudável</p>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="bg-[#4CAF50] w-8 h-8 rounded-full flex items-center justify-center">
                              <Volleyball className="text-white" size={18} />
                          </div>
                          <p>Diversidade de modalidades</p>
                      </div>
                  </div>
              </div>

              <div className="flex-shrink-0 w-full lg:w-auto max-w-xl">
                  <Image
                      src={bannerImg}
                      alt="Imagens do IFSports"
                      width={1280}
                      height={720}
                      className="w-full h-auto rounded-md"
                  />
              </div>
          </div>

          <div className="mt-16" id="competitions-anchor">
              <div className="flex items-start justify-between">
                  <h2 className="text-3xl font-bold text-[#062601] font-title">
                      Competições
                  </h2>
                  <div className="flex">
                    <CompetitionsFilter 
                      label="o campus" 
                      data={campusData}
                      value={campus}
                      onChange={(value) => {
                        setCampus(value);
                        setIsCampusSelected(false);
                        setSelectedCampus("");
                      }} 
                    />
                    <Button 
                      onClick={() => { setIsCampusSelected(true); setSelectedCampus(campus); }} 
                      variant={"link"} 
                      disabled={!campus || isLoadingCompetitions}
                      className="rounded-none rounded-tr-lg rounded-br-lg border-none cursor-pointer text-[#ffffff] bg-[#4CAF50] hover:bg-[#147A02]"
                    >
                      <Search size={18} />
                    </Button>
                  </div>
              </div>

              <Carousel className="max-[1320px]:mx-10">
                  <CarouselContent>
                    {competitions && competitions.length > 0 ?
                        groupedCompetitions.map((group, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className={`grid gap-6 px-4 py-10 ${
                                isMobile
                                ? 'grid-cols-1'
                                : isTablet
                                    ? 'grid-cols-2'
                                    : 'grid-cols-3'
                            }`}>
                                {group.map((competition) => (
                                    <CompetitionCard key={competition.id} competition={competition} campusId={selectedCampus} />
                                ))}
                            </div>
                        </CarouselItem>
                        )
                    ) : (
                        <div className="flex items-center justify-center w-full h-96">
                            {isLoadingCompetitions ? (
                                <span className="text-gray-500">Carregando competições...</span>
                            ) : (
                               campus && selectedCampus && isCampusSelected ? (
                                    <span className="text-gray-500">Nenhuma competição encontrada.</span>
                                ) : (
                                    <span className="text-gray-500">Selecione um campus...</span>
                                )
                            )
                            }
                        </div>
                    )}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
              </Carousel>
          </div>

          <div className="bg-[#F5F6FA] w-screen overflow-x-hidden ml-[calc(-50vw+50%)]" id="games-anchor">
              <div className="max-w-[80rem] mx-auto w-full px-[2.5rem] pt-8 pb-12">
                  <h2 className="text-3xl font-bold text-[#062601] font-title">
                      Jogos de hoje
                  </h2>

                  <div className="mt-8 flex flex-col gap-8">
                    {isLoadingTeams ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-gray-500">Carregando times...</span>
                        </div>
                    ) : !selectedCampus ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-gray-500">Selecione um campus para ver os jogos.</span>
                        </div>
                    ) : matchesToday?.length === 0 ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-gray-500">Nenhum jogo encontrado para hoje.</span>
                        </div>
                    ) : (
                        matchesToday?.map((match, index) => {
                        const pair = teamPairs.find(p => p.matchId === match.id);

                        return (
                            <div key={index} className="p-8 bg-white rounded-lg grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                                <div className="text-[#4F4F4F]">
                                    <div className="flex justify-around items-center flex-col sm:flex-row gap-2">
                                    <p>{pair?.homeTeam?.name ?? "Time A"}</p>
                                    <span className="text-black text-opacity-75">VS</span>
                                    <p>{pair?.awayTeam?.name ?? "Time B"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-16 justify-around text-[#4F4F4F] flex-col sm:flex-row">
                                    <div className="flex items-center justify-center gap-2">
                                        <Clock className="text-xl text-[#4CAF50]" />
                                        <span>{dayjs(match.scheduled_datetime).format("HH:mm")}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Volleyball className="text-xl text-[#4CAF50]" />
                                        <span>{pair?.competition?.name}</span>
                                    </div>
                                </div>
                            </div>
                        );
                        })
                    )}
                    </div>
              </div>
          </div>

          <div className="mt-12 flex items-start justify-between gap-12 flex-col lg:flex-row">
              <div className="p-10 border border-gray-100 rounded-md shadow-2xl flex justify-start flex-col">
                  <h3 className="text-2xl font-bold text-[#062601] pb-4 border-b border-gray-100 font-title">
                      Inscreva sua equipe
                  </h3>
                  <p className="max-w-md w-full my-10 text-[#4F4F4F] text-lg">
                      Estamos convidando os estudantes a fazerem parte desse grande campeonato!
                      As equipes podem se inscrever em diversas modalidades, competindo pelo
                      título e fortalecendo o espírito esportivo da instituição. Utilize nosso
                      sistema de inscrição para escolher a modalidade e garantir sua
                      participação. Venha representar seu curso e faça parte da história!
                  </p>
                  <Link
                      href="/gerenciar-equipes"
                      className="px-6 py-4 border-0 bg-[#4CAF50] rounded-md font-bold text-white tracking-wider cursor-pointer no-underline ml-auto"
                  >
                      Cadastrar equipes
                  </Link>
              </div>

              <div className="p-10 border border-gray-100 rounded-md shadow-2xl flex justify-start flex-col">
                  <h3 className="text-2xl font-bold text-[#062601] pb-4 border-b border-gray-100 font-title">
                      Verifique o regulamento
                  </h3>
                  <p className="max-w-md w-full my-10 text-lg text-[#4F4F4F]">
                      Aqui, você encontrará todas as informações essenciais para participar de
                      nossos eventos esportivos com transparência e de acordo com as regras
                      estabelecidas. Leia atentamente o regulamento e verifique as condições
                      para garantir sua participação dentro dos critérios exigidos.
                  </p>
                  <a
                      href="#"
                      className="px-6 py-4 border-0 bg-[#4CAF50] rounded-md font-bold text-white tracking-wider cursor-pointer no-underline ml-auto"
                  >
                      Ir para o regulamento
                  </a>
              </div>
          </div>
      </div>
  );
};