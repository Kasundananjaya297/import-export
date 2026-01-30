import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

interface Listing {
    _id: string;
    species?: { name: string };
    variety?: { name: string };
    stall?: { location: string };
    images: string[];
    price: { retail: number };
    gender: string;
    size: string | number;
    age: string | number;
}

const Home = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const products = await productService.getProducts();
            const listingsData: Listing[] = products.map(product => ({
                _id: product.id.toString(),
                species: { name: product.name },
                variety: { name: product.category },
                stall: { location: product.origin },
                images: product.images,
                price: { retail: parseFloat(product.price) },
                gender: 'N/A', // Placeholder as not in Product interface
                size: product.unit,
                age: 'N/A' // Placeholder
            }));

            setListings(listingsData);
            setFilteredListings(listingsData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setListings([]);
            setFilteredListings([]);
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        const filtered = listings.filter(item =>
            item.species?.name.toLowerCase().includes(query) ||
            item.variety?.name.toLowerCase().includes(query) ||
            item.stall?.location.toLowerCase().includes(query)
        );
        setFilteredListings(filtered);
    };

    return (
        <div className="max-w-7xl mx-auto p-3 md:p-6">
            <div className="text-center py-10">
                <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden md:block">
                    Find Your Perfect Fish
                </h1>
                <p className="text-slate-400 text-sm md:text-lg mb-4 md:mb-8 hidden md:block">Discover rare breeds from top breeders near you</p>

                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        className="w-full glass-input pl-10 md:pl-12 pr-4 py-2 md:py-4 rounded-full text-sm md:text-lg shadow-2xl shadow-cyan-500/10 border-2 border-slate-200"
                        placeholder="Search species..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                    {filteredListings.map(item => (
                        <div key={item._id} className="glass-card rounded-xl overflow-hidden group flex flex-row sm:flex-col h-28 sm:h-auto border border-slate-200">
                            {/* Image Section */}
                            <div className="w-32 sm:w-full h-full sm:aspect-square bg-slate-800 relative flex-shrink-0">
                                {item.images && item.images.length > 0 ? (
                                    <img src={item.images[0]} alt={item.species?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Image</div>
                                )}
                                <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] sm:text-xs">
                                    {item.stall?.location}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-xs sm:text-lg truncate">{item.species?.name}</h3>
                                        <p className="text-[10px] sm:text-sm text-cyan-400 truncate">{item.variety?.name}</p>
                                    </div>
                                    <span className="font-bold text-xs sm:text-lg flex-shrink-0">Rs.{item.price.retail}</span>
                                </div>

                                {/* Details - Hidden/Simplified on mobile */}
                                <div className="hidden sm:flex flex-wrap gap-2 text-xs text-slate-400 mt-4 border-t border-white/5 pt-3">
                                    <span className="bg-white/5 px-2 py-1 rounded text-slate-300">
                                        <span className="text-cyan-400 font-bold">Gender:</span> {item.gender}
                                    </span>
                                    <span className="bg-white/5 px-2 py-1 rounded text-slate-300">
                                        <span className="text-cyan-400 font-bold">Size:</span> {item.size && (typeof item.size === 'number' || !isNaN(Number(item.size))) ? `${item.size}"` : item.size}
                                    </span>
                                    <span className="bg-white/5 px-2 py-1 rounded text-slate-300">
                                        <span className="text-cyan-400 font-bold">Age:</span> {item.age && (typeof item.age === 'number' || !isNaN(Number(item.age))) ? `${item.age}mo` : item.age}
                                    </span>
                                </div>

                                <Link to={`/listing/${item._id}`} className="mt-2 sm:mt-4 bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all py-1.5 sm:py-2 rounded-2xl text-[10px] sm:text-sm font-medium sm:opacity-0 group-hover:opacity-100 transition-opacity block text-center">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
