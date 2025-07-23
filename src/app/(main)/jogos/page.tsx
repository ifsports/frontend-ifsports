import GamesContainer from "@/components/features/games/games-container";

export default function GamesPage(){
    return (
        <section>
            <div className="my-12 flex flex-col gap-3 max-w-[39.375rem]">
                <h2 className="font-title text-3xl font-bold text-[#062601]">Acompanhar jogos</h2>
                <p className="text-[#4F4F4F]">Nesta seção, você poderá acompanhar as partidas em tempo real,
                    visualizando tudo o que está acontecendo em cada jogo, minuto a minuto.
                    Além disso, é possível interagir com outros usuários por meio de um chat
                    ao vivo, tornando a experiência ainda mais dinâmica e imersiva. Aqui,
                    você não perde nenhum lance e ainda compartilha suas impressões com outros
                    torcedores.</p>
            </div>

            <div>
                <GamesContainer />
            </div>

        </section>
    )
}