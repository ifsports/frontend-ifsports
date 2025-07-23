"use client"

import {useEffect, useState} from 'react';
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
import {Button} from "@/components/ui/button";

export default function Home(){
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    const groupCompetitions = (competitions, itemsPerSlide) => {
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



    const competitions = [
        {
            name: 'Basquete',
            description: 'Acesse a página com todas as informações sobre o basquete, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: true
        },
        {
            name: 'Vôlei de Areia Masculino',
            description: 'Acesse a página com todas as informações sobre o vôlei de areia masculino, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        },
        {
            name: 'Vôlei de Areia Feminino',
            description: 'Acesse a página com todas as informações sobre o vôlei de areia feminino, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        },
        {
            name: 'Vôlei Indoor',
            description: 'Acesse a página com todas as informações sobre o vôlei indoor, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: true
        },
        {
            name: 'Futsal Masculino',
            description: 'Acesse a página com todas as informações sobre o futsal masculino, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: true
        },
        {
            name: 'Futsal Feminino',
            description: 'Acesse a página com todas as informações sobre o futsal feminino, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        },
        {
            name: 'Handebol',
            description: 'Acesse a página com todas as informações sobre o handebol, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        },
        {
            name: 'Queimada',
            description: 'Acesse a página com todas as informações sobre a queimada, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        },
        {
            name: 'Tênis de Mesa',
            description: 'Acesse a página com todas as informações sobre o tênis de mesa, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        },
        {
            name: 'Tênis de Mesa 2',
            description: 'Acesse a página com todas as informações sobre o tênis de mesa, incluindo equipes participantes, horários dos jogos e resultados atualizados.',
            image: '/api/placeholder/320/180',
            hasLink: false
        }
    ];

    const itemsPerSlide = isMobile ? 1 : isTablet ? 2 : 3;
    const groupedCompetitions = groupCompetitions(competitions, itemsPerSlide);

    const games = [
        {
            team1: 'ADS FC',
            team2: 'Informática FC',
            time: '20:30h',
            location: 'Ginásio Poliesportivo',
            sport: 'Futsal Masculino'
        },
        {
            team1: 'ADS FC',
            team2: 'Informática FC',
            time: '20:30h',
            location: 'Ginásio Poliesportivo',
            sport: 'Futsal Masculino'
        }
    ];

    const campusData = [
        {
            "value": "PF",
            "label": "Pau dos Ferros",
        },
        {
            "value": "ZL",
            "label": "Zona Leste",
        },
        {
            "value": "NC",
            "label": "Natal Central",
        },
    ]

    return (
        <div className="my-16">
            {/* Banner Section */}
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

            {/* Competitions Section */}
            <div className="mt-16" id="competitions-anchor">
                <div className="flex items-start justify-between">
                    <h2 className="text-3xl font-bold text-[#062601] font-title">
                        Competições
                    </h2>
                    <div className="flex">
                        <CompetitionsFilter label="o campus" data={campusData} />
                    </div>
                </div>

                <Carousel className="mt-8 max-[1320px]:mx-10">
                    <CarouselContent>
                        {groupedCompetitions.map((group, slideIndex) => (
                            <CarouselItem key={slideIndex}>
                                <div className={`grid gap-6 px-4 ${
                                    isMobile
                                        ? 'grid-cols-1'
                                        : isTablet
                                            ? 'grid-cols-2'
                                            : 'grid-cols-3'
                                }`}>
                                    {group.map((competition, index) => (
                                        <div
                                            key={index}
                                            className="w-full h-96 p-6 rounded shadow-2xl flex flex-col justify-between items-start gap-6 bg-white"
                                        >
                                            <div className="relative w-full h-40 overflow-hidden rounded">
                                                {competition.image ? (
                                                    <Image
                                                        src={competition.image}
                                                        alt={competition.name || ''}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                                                        <span className="text-gray-400">Sem imagem</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="font-medium text-base">{competition.name}</span>
                                                <p className="text-[#676767] text-sm text-justify">
                                                    {competition.description}
                                                </p>
                                            </div>
                                            <button className="ml-auto border-0 px-8 py-2 text-white text-sm font-bold bg-[#4CAF50] rounded cursor-pointer tracking-wider">
                                                {competition.hasLink ? (
                                                    <a href="#" className="text-white no-underline">Acessar</a>
                                                ) : (
                                                    'Acessar'
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            {/* Games Today Section */}
            <div className="bg-[#F5F6FA] w-screen overflow-x-hidden ml-[calc(-50vw+50%)]" id="games-anchor">
                <div className="max-w-[80rem] mx-auto w-full px-[2.5rem] pt-8 pb-12">
                    <h2 className="text-3xl font-bold text-[#062601] font-title">
                        Jogos de hoje
                    </h2>

                    <div className="mt-8 flex flex-col gap-8">
                        {games.map((game, index) => (
                            <div key={index} className="p-8 bg-white rounded-lg grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                                <div className="text-[#4F4F4F]">
                                    <div className="flex justify-around items-center flex-col sm:flex-row gap-2">
                                        <p>{game.team1}</p>
                                        <span className="text-black text-opacity-75">VS</span>
                                        <p>{game.team2}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-16 justify-around text-[#4F4F4F] flex-col sm:flex-row">
                                    <div className="flex items-center justify-center gap-2">
                                        <Clock className="text-xl text-[#4CAF50]" />
                                        <span>{game.time}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <MapPin className="text-xl text-[#4CAF50]" />
                                        <span>{game.location}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Volleyball className="text-xl text-[#4CAF50]" />
                                        <span>{game.sport}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Cards Section */}
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
                    <a
                        href="#"
                        className="px-6 py-4 border-0 bg-[#4CAF50] rounded-md font-bold text-white tracking-wider cursor-pointer no-underline ml-auto"
                    >
                        Cadastrar equipes
                    </a>
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