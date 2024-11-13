import { useRef, useEffect,useState } from "react";
import { MdOutlineAutorenew  } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";

export default function GetComics ({ mostrarFavoritos }) {
    const publicKey = "32817b5ea7eecf83f847c3c00798974e";
    const hash = 'da2cae1419ca7dd87f7b1c9602dc0ba1'

    //const url = `https://gateway.marvel.com/v1/public/comics?ts=${1}&apikey=${publicKey}&hash=${hash}&limit=100&offset=145&orderBy=-focDate`;

    const [comics, setComics]= useState([]);
    const [comicSeleccionado, setComicSeleccionado] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [offset, setOffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [favorito, setFavorito]= useState(() => {
        const savedFavorites = localStorage.getItem("favorito");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        const newUrl = `https://gateway.marvel.com/v1/public/comics?ts=1&apikey=${publicKey}&hash=${hash}&limit=30&offset=${offset}&orderBy=-focDate`;
        fetch(newUrl)
            .then((response) => response.json())
            .then((data) => {
                setComics((prevComics) => {
                    const existingIds = new Set(prevComics.map((comic) => comic.id));
                    const uniqueComics = data.data.results.filter((comic) => !existingIds.has(comic.id));
                    return [...prevComics, ...uniqueComics];
                });
            });
    }, [offset]);

    const loadMoreComics = () => {
        setOffset((prevOffset) => prevOffset + 30);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                loadMoreComics();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [offset]);


    useEffect(() => {
        if (comicSeleccionado) {
            const comicId = comicSeleccionado.id;
            const charactersUrl = `https://gateway.marvel.com/v1/public/comics/${comicId}/characters?ts=${1}&apikey=${publicKey}&hash=${hash}`;
            fetch(charactersUrl)
                .then((response) => response.json())
                .then((data) => {
                    setCharacters(data.data.results);
                });
        }
    }, [comicSeleccionado]);

    const abrirDetallesComic = (comic) => {
        setComicSeleccionado(comic);
    };

    const addToFavorites = (comic) => {
        const isFavorito = favorito.some(fav => fav.id === comic.id);
        const updatedFav = isFavorito ? favorito.filter(fav => fav.id !== comic.id) : [comic, ...favorito]; 
        setFavorito(updatedFav);
        localStorage.setItem("favorito", JSON.stringify(updatedFav));
    };

    const comicsVistos = mostrarFavoritos ? favorito : comics;

    return (

        <div  className="options1" id="comienzo">	

            <div className="frase1">{mostrarFavoritos ? "Tus Comics Favoritos" : "Empieza tu aventura en Marvel"}</div>

            <div className="container_comics">

                {comicsVistos.map(comic => 
                    
                    <div key={comic.id} className="comic_impresos" onClick={() => abrirDetallesComic(comic)}>

                        <div className="botton_favorito">
                            <FaRegStar className={`favorito-icon ${favorito.some(fav => fav.id === comic.id) ? 'favorito' : ''}`} onClick={(e) => {
                                e.stopPropagation();
                                addToFavorites(comic);
                            }}/>
                        </div>

                        <div className="titulo_comics">{comic.title}</div>
                        
                        <img 
                            src={comic.thumbnail.path.includes("image_not_available") ? "https://cdn.marvel.com/content/1x/default/comic-no-img.jpg" : `${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                            alt={comic.title} className="imagen_comics"
                        />

                    </div>

                )}

            </div>
            {comicSeleccionado && (
                <div className="popup-overlay" onClick={() => setComicSeleccionado(null)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="botton_favorito">
                            <FaRegStar className={`favorito-icon ${favorito.some(fav => fav.id === comicSeleccionado.id) ? 'favorito' : ''}`} onClick={(e) => {
                                e.stopPropagation();
                                addToFavorites(comicSeleccionado);
                            }}/>
                        </div>
                        <h2 className="texto_popup">{comicSeleccionado.title}</h2>
                        <img 
                            src={comicSeleccionado.thumbnail.path.includes("image_not_available") ? "https://cdn.marvel.com/content/1x/default/comic-no-img.jpg" : `${comicSeleccionado.thumbnail.path}.${comicSeleccionado.thumbnail.extension}`}
                            alt={comicSeleccionado.title} 
                            className="popup-image" 
                        />

                        <br></br>
                        <h2 className="texto_popup_titulos">Description</h2>
                        <p className="texto_popup">{comicSeleccionado.textObjects?.[0]?.text.replace(/<[^>]*?>/g, ' ') || "No description available."}</p>

                        <br></br>
                        <h2 className="texto_popup_titulos">Prices</h2>
                        {comicSeleccionado.prices.map((price, index) => 
                            <p key={index} className="texto_popup">{price.type}: ${price.price}</p>
                        )}
                        
                        <br></br>
                        <h2 className="texto_popup_titulos">Creators</h2>
                        {comicSeleccionado.creators.items.map((creator, index) => 
                            <p key={index} className="texto_popup">{creator.role}: {creator.name}</p>
                        )}

                        <br></br>
                        <h2 className="texto_popup_titulos">Characters</h2>
                        {characters.map((character, index) => 
                            <div key={index} className="characters">
                                <p className="texto_popup">{character.name}</p>
                                <img 
                                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                                    className="imagen_characters"
                                />
                            </div>
                        )}
                        <button onClick={() => setComicSeleccionado(null)}>Close</button>
                    </div>
                </div>
            )}

        </div>

    )
}
