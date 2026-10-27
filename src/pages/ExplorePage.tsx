import React, { useState } from 'react';
import { PropertyRecord, LocalityInfo } from '../types';
import { Search, Filter, Grid, List, MapPin, Eye, ArrowUpDown, ChevronRight, X, ExternalLink } from 'lucide-react';
import { formatIndianCurrency } from '../services/mlEngine';
import { InteractiveMap } from '../components/InteractiveMap';
import { FloorPlanViewer } from '../components/FloorPlanViewer';

interface ExplorePageProps {
  properties: PropertyRecord[];
  localities: LocalityInfo[];
  onPredictForLocality: (locality: string) => void;
  onSelectPropertyToPredict: (prop: PropertyRecord) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  properties,
  localities,
  onPredictForLocality,
  onSelectPropertyToPredict
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'listings' | 'floorplans'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState<string>('All');
  const [bhkFilter, setBhkFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'area_asc' | 'area_desc' | 'rate_asc' | 'rate_desc'>('price_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal inspection state
  const [inspectedProperty, setInspectedProperty] = useState<PropertyRecord | null>(null);

  // Filtering
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocality = selectedLocality === 'All' || p.location === selectedLocality;
    const matchesBhk = bhkFilter === 'All' || p.bhk === Number(bhkFilter);
    const matchesType = typeFilter === 'All' || p.property_type === typeFilter;
    return matchesSearch && matchesLocality && matchesBhk && matchesType;
  });

  // Sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'area_asc') return a.total_sqft - b.total_sqft;
    if (sortBy === 'area_desc') return b.total_sqft - a.total_sqft;
    if (sortBy === 'rate_asc') return a.price_per_sqft - b.price_per_sqft;
    if (sortBy === 'rate_desc') return b.price_per_sqft - a.price_per_sqft;
    return 0;
  });

  return (
    <div className="space-y-8 py-8">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Bengaluru Properties & Localities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse verified listings, explore geographic price distributions on OpenStreetMap, and inspect 2D room layouts.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'map'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Geographic Map
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'listings'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Property Explorer ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('floorplans')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'floorplans'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2D Floor Plans
          </button>
        </div>
      </div>

      {/* VIEW 1: MAP VIEW */}
      {activeTab === 'map' && (
        <InteractiveMap
          localities={localities}
          properties={properties}
          onSelectLocality={(loc) => setSelectedLocality(loc.name)}
          onPredictForLocality={onPredictForLocality}
          selectedLocalityName={selectedLocality !== 'All' ? selectedLocality : undefined}
        />
      )}

      {/* VIEW 2: LISTINGS EXPLORER */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Filter selectors */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Localities</option>
                {localities.map((l) => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </select>

              <select
                value={bhkFilter}
                onChange={(e) => setBhkFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Independent House">House</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_asc">Area: Small to Large</option>
                <option value="area_desc">Area: Large to Small</option>
                <option value="rate_asc">₹/Sq.Ft: Low to High</option>
                <option value="rate_desc">₹/Sq.Ft: High to Low</option>
              </select>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-200 dark:bg-slate-700' : 'text-slate-400'}`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-200 dark:bg-slate-700' : 'text-slate-400'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Properties Display */}
          {sortedProperties.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">No properties match your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocality('All');
                  setBhkFilter('All');
                  setTypeFilter('All');
                }}
                className="mt-2 text-xs font-semibold text-emerald-600 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Property Image with graceful fallback */}
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {prop.image ? (
                        <img
                          src={prop.image}
                          alt={`${prop.bhk} BHK in ${prop.location}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          Residential Photo
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-bold">
                        {formatIndianCurrency(prop.price)}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {prop.location}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {prop.property_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{prop.bhk} BHK</span>
                        <span>·</span>
                        <span>{prop.bath} Baths</span>
                        <span>·</span>
                        <span className="font-mono">{prop.total_sqft} sq.ft</span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono">
                        ₹{prop.price_per_sqft.toLocaleString('en-IN')}/sq.ft · {prop.area_type}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-2 flex items-center justify-between">
                    <button
                      onClick={() => setInspectedProperty(prop)}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    <button
                      onClick={() => onSelectPropertyToPredict(prop)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Run ML Valuation →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {sortedProperties.map((prop) => (
                <div key={prop.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={prop.image}
                      alt={prop.location}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {prop.bhk} BHK in {prop.location}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {prop.total_sqft} sq.ft · {prop.bath} Baths · {prop.property_type} · {prop.area_type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatIndianCurrency(prop.price)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ₹{prop.price_per_sqft.toLocaleString('en-IN')}/sq.ft
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPropertyToPredict(prop)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
                    >
                      Valuate Unit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: 2D FLOOR PLAN GENERATOR */}
      {activeTab === 'floorplans' && (
        <FloorPlanViewer initialBhk={3} initialSqft={1500} />
      )}

      {/* Property Details Modal */}
      {inspectedProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="relative h-56 bg-slate-100">
              <img
                src={inspectedProperty.image}
                alt={inspectedProperty.location}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setInspectedProperty(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {inspectedProperty.bhk} BHK {inspectedProperty.property_type}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{inspectedProperty.location}, Bengaluru</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {formatIndianCurrency(inspectedProperty.price)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ₹{inspectedProperty.price_per_sqft.toLocaleString('en-IN')}/sq.ft
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Area</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {inspectedProperty.total_sqft} sq.ft
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bathrooms</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {inspectedProperty.bath} Baths
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Balconies</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {inspectedProperty.balcony} Balconies
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                Authentic Bengaluru Housing dataset record. Society identifier: {inspectedProperty.society || 'Unlisted Independent'}. Availability status: {inspectedProperty.availability}.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setInspectedProperty(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const p = inspectedProperty;
                    setInspectedProperty(null);
                    onSelectPropertyToPredict(p);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Predict Similar Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
