import { useState, useEffect } from "react";
import "./PokemonGenerator.css"

type PokemonData = {
    name: string;             // Name of the Pokémon
    shortname: string;        // Short name or lowercase version (e.g., "pikachu")
    hp: number;               // HP of the Pokémon
    info: { 
      id: number;             // Pokémon ID (e.g., 25 for Pikachu)
      type: string;           // Type of the Pokémon (e.g., "electric")
      weakness: string;       // Pokémon's weakness (e.g., "ground")
      description: string;    // Description of the Pokémon
    };
    images: { 
      photo: string;          // Path to the photo of the Pokémon
      typeIcon: string;       // Icon representing the Pokémon's type
      weaknessIcon: string;   // Icon representing the Pokémon's weakness
    };
    moves: { 
      name: string;           // Name of the move
      dp?: number;            // Damage points (optional)
      type: string;           // Type of the move (e.g., "electric")
    }[];
  };

export default function PokemonGenerator() {
    const [pokemon, setPokemon] = useState<PokemonData | null>(null)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    const fetchPokemon = async () => {
        try {
            const randomId = Math.floor(Math.random() * 1000)
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`)
            if (!res.ok) throw new Error(`Error fetching Data ${res.status}`)
            const data = await res.json()
            setPokemon({
                name: data.name,
                shortname: data.name.toLowerCase(),
                hp: data.stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
                info: {
                    id: data.id,
                    type: data.types[0].type.name, // Assuming first type
                    weakness: "unknown",  // Placeholder, needs additional logic to fetch weaknesses
                    description: "A wild Pokémon!" // Placeholder for description
                },
                images: {
                    photo: data.sprites.front_default,
                    typeIcon: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/types/${data.types[0].type.name}.png`,
                    weaknessIcon: "icons/unknown.png" // Placeholder for weakness icon
                },
                moves: data.moves.slice(0, 3).map((move: any) => ({
                    name: move.move.name,
                    dp: move.version_group_details[0]?.level_learned_at, // Placeholder for damage points
                    type: data.types[0].type.name // Assuming first type
                }))
            });
            } catch(err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
    };
    useEffect(() => {
        fetchPokemon();
    }, []);
    return (
        <div className="pokemon-generator">
            <h1 className="fade-in">Welcome to Pokemon Generator!</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : pokemon ? (
                <div>
                    <h1>{pokemon.name}</h1>
                    <img src={pokemon.images.photo} alt={pokemon.name} />
                    <p><strong>HP: {pokemon.hp}</strong></p>
                    <p><strong>Type: {pokemon.info.type}</strong></p>
                    <p><strong>Weakness: {pokemon.info.weakness}</strong></p>
                    <p><strong>{pokemon.info.description}</strong></p>
                    <ul>
                        {pokemon.moves.map((move) => (
                            <li key={move.name}>{move.name} - {move.dp ? `Damage: ${move.dp}` : "No damage info"}</li> 
                        ))}
                    </ul>
                </div>
            ): null}
            <button onClick={fetchPokemon}>Generate Random Pokemon</button>
        </div>
    )
}