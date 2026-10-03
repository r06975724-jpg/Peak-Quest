import os
import re

# 1. Modify FilterBar.tsx
with open('src/components/FilterBar.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Region, Difficulty, Season } from '../types';", "import { DestinationType, Difficulty, Season } from '../types';\nimport { ALL_STATE_NAMES } from '../data/states';")

content = content.replace("selectedRegion: Region | 'All';", "selectedState: string;\n  onSelectState: (state: string) => void;\n  selectedType: DestinationType | 'All';\n  onSelectType: (type: DestinationType | 'All') => void;")
content = content.replace("onSelectRegion: (r: Region | 'All') => void;", "")

content = content.replace("selectedRegion,", "selectedState,\n  onSelectState,\n  selectedType,\n  onSelectType,")
content = content.replace("onSelectRegion,", "")

content = content.replace("const isFiltered = selectedRegion !== 'All'", "const isFiltered = selectedState !== '' || selectedType !== 'All'")

# Replace the region selector
region_selector_regex = r"<div>\s*<label className=\"block font-bold text-\[\#5C6662\] uppercase tracking-wider mb-1\.5\">\s*Indian State / Region\s*</label>\s*<div className=\"flex rounded-xl bg-\[\#F3F1EA\] p-1 border border-\[\#E8E4D9\]\">[\s\S]*?</button>\s*</div>\s*</div>"
new_selectors = """<div>
          <label className="block font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
            Indian State / Region
          </label>
          <select
            value={selectedState}
            onChange={(e) => onSelectState(e.target.value)}
            className="bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D3633] focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 min-w-[160px] w-full"
          >
            <option value="">All India</option>
            {ALL_STATE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="mt-3">
            <label className="block font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
              Destination Type
            </label>
            <div className="flex gap-1 bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl p-0.5">
              {(['All', 'trek', 'fort'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onSelectType(t === 'All' ? 'All' : t)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedType === t
                      ? 'bg-[#4A6741] text-white shadow-sm'
                      : 'text-[#5C6662] hover:text-[#2D3633]'
                  }`}
                >
                  {t === 'All' ? '🏔️ All' : t === 'trek' ? '🥾 Treks' : '🏰 Forts'}
                </button>
              ))}
            </div>
          </div>
        </div>"""
content = re.sub(region_selector_regex, new_selectors, content)

with open('src/components/FilterBar.tsx', 'w') as f:
    f.write(content)


# 2. Modify Navbar.tsx
with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Region, UserProfile } from '../types';", "import { UserProfile } from '../types';\nimport { ALL_STATE_NAMES } from '../data/states';")

content = content.replace("selectedRegion: Region | 'All';", "selectedState: string;")
content = content.replace("onSelectRegion: (region: Region | 'All') => void;", "onSelectState: (state: string) => void;")

content = content.replace("selectedRegion,", "selectedState,")
content = content.replace("onSelectRegion,", "onSelectState,")

content = content.replace("onSelectRegion('All');", "onSelectState('');")

desktop_nav_regex = r"<nav className=\"hidden lg:flex items-center bg-\[\#F3F1EA\] p-1 rounded-2xl border border-\[\#E8E4D9\] text-xs font-semibold\">[\s\S]*?</nav>"
new_desktop_nav = """<nav className="hidden lg:flex items-center">
            <select
              value={selectedState}
              onChange={(e) => onSelectState(e.target.value)}
              className="bg-[#1E2822] border border-[#3D5636] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#C8D6B9] focus:outline-none focus:ring-2 focus:ring-[#86EFAC]/30 min-w-[140px]"
            >
              <option value="">🇮🇳 All India</option>
              {ALL_STATE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </nav>"""
content = re.sub(desktop_nav_regex, new_desktop_nav, content)

mobile_nav_regex = r"<!-- Mobile Region Tabs -->\s*<div className=\"grid grid-cols-3 gap-1\.5 text-xs font-semibold\">[\s\S]*?</div>"
new_mobile_nav = """{/* Mobile Region Tabs */}
            <select
              value={selectedState}
              onChange={(e) => { onSelectState(e.target.value); setMobileMenuOpen(false); }}
              className="w-full bg-[#2D3633] border border-[#3D5636] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#C8D6B9] focus:outline-none"
            >
              <option value="">🇮🇳 All India</option>
              {ALL_STATE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>"""
content = re.sub(r"\{\/\* Mobile Region Tabs \*\/\}\s*<div className=\"grid grid-cols-3 gap-1\.5 text-xs font-semibold\">[\s\S]*?</div>", new_mobile_nav, content)

content = content.replace('placeholder="Search Kedarkantha, Triund..."', 'placeholder="Search treks, forts, states..."')
content = content.replace('placeholder="Search Himachal & Uttarakhand treks..."', 'placeholder="Search treks, forts across India..."')

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)


# 3. Modify HeroSection.tsx
with open('src/components/HeroSection.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Region } from '../types';", "import { DESTINATIONS_DATA } from '../data/destinations';")
content = content.replace("selectedRegion: Region | 'All';", "selectedState: string;")
content = content.replace("onSelectRegion: (region: Region | 'All') => void;", "onSelectState: (state: string) => void;")

content = content.replace("selectedRegion,", "selectedState,")
content = content.replace("onSelectRegion,", "onSelectState,")

trek_ids_regex = r"const TREK_IDS = \[[^\]]*\];"
new_trek_ids = """const WEATHER_DESTINATIONS = DESTINATIONS_DATA
  .filter(d => d.featured || d.rating && d.rating >= 4.5)
  .slice(0, 12)
  .map(d => ({ id: d.id, label: d.name, lat: d.lat, lon: d.lon, altitudeM: d.altitudeM || 1000, state: d.state }));"""
content = re.sub(trek_ids_regex, new_trek_ids, content)

content = content.replace("TREK_IDS.find", "WEATHER_DESTINATIONS.find")

# badge text
content = content.replace("<span>Himachal Pradesh & Uttarakhand Expeditions</span>", "<span>{selectedState ? `${selectedState} Adventures` : 'All-India Trekking & Fort Discovery'}</span>")

# buttons
buttons_regex = r"<div className=\"flex flex-wrap items-center gap-3 pt-1\">[\s\S]*?</div>"
new_buttons = """<div className="flex flex-wrap items-center gap-3 pt-1">
              <button onClick={() => { onSelectState(''); onScrollToTreks(); }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${selectedState === '' ? 'bg-[#4A6741] text-[#FDFCF7] ring-2 ring-[#A8C69F]' : 'bg-[#2D3633]/80 border border-[#4A6741]/40 text-[#E8E4D9] hover:bg-[#3D5636]'}`}>
                All India ({totalTreksCount})
              </button>
            </div>"""
content = re.sub(buttons_regex, new_buttons, content)

# weather fetch
weather_fetch_regex = r"const res = await fetch\(`/api/weather\?trekId=\$\{trekId\}`\);"
new_weather_fetch = """const dest = WEATHER_DESTINATIONS.find(d => d.id === trekId);
      const weatherUrl = dest
        ? `/api/weather?lat=${dest.lat}&lon=${dest.lon}&name=${encodeURIComponent(dest.label)}&altitude=${dest.altitudeM}&region=${encodeURIComponent(dest.state)}`
        : `/api/weather?trekId=${trekId}`;
      const res = await fetch(weatherUrl);"""
content = re.sub(weather_fetch_regex, new_weather_fetch, content)

content = content.replace("TREK_IDS.map", "WEATHER_DESTINATIONS.map")

with open('src/components/HeroSection.tsx', 'w') as f:
    f.write(content)


# 4. Modify LiveWeatherModal.tsx
with open('src/components/LiveWeatherModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Trek, LiveWeatherReport } from '../types';", "import { Trek, LiveWeatherReport, Destination } from '../types';\nimport { DESTINATIONS_DATA } from '../data/destinations';")

content = content.replace("treks: Trek[];", "treks: Trek[];\n  destinations?: Destination[];")
content = content.replace("treks,", "treks,\n  destinations,")

content = content.replace("regionFilter: 'All' | 'Himachal Pradesh' | 'Uttarakhand'", "regionFilter: string")
content = content.replace("regionFilter: 'All'", "regionFilter: string")
content = content.replace("useState<'All' | 'Himachal Pradesh' | 'Uttarakhand'>('All')", "useState<string>('All')")

# allLocations computation
memo_import = "import React, { useState, useEffect, useMemo } from 'react';"
content = content.replace("import React, { useState, useEffect } from 'react';", memo_import)

locations_code = """  const allLocations = useMemo(() => {
    const trekLocs = treks.map(t => ({
      id: t.id, name: t.name, state: t.region || t.state || '', lat: 0, lon: 0, altitudeM: t.maxAltitudeM,
    }));
    const destLocs = (destinations || DESTINATIONS_DATA).map(d => ({
      id: d.id, name: d.name, state: d.state, lat: d.lat, lon: d.lon, altitudeM: d.altitudeM || 1000,
    }));
    const map = new Map<string, typeof trekLocs[0]>();
    destLocs.forEach(d => map.set(d.id, d));
    trekLocs.forEach(t => { if (!map.has(t.id)) map.set(t.id, t); });
    return Array.from(map.values());
  }, [treks, destinations]);

  const availableStates = useMemo(() => {
    const states = [...new Set(allLocations.map(l => l.state).filter(Boolean))];
    return ['All', ...states.sort()];
  }, [allLocations]);"""

# insert after `const activeTrek = treks.find((t) => t.id === selectedTrekId) || treks[0];`
content = content.replace("const activeTrek = treks.find((t) => t.id === selectedTrekId) || treks[0];", "const activeTrek = treks.find((t) => t.id === selectedTrekId) || treks[0];\n\n" + locations_code)

weather_fetch_regex2 = r"const res = await fetch\(`/api/weather\?trekId=\$\{selectedTrekId\}`\);"
new_weather_fetch2 = """const loc = allLocations.find(l => l.id === selectedTrekId);
        const url = loc && loc.lat
          ? `/api/weather?lat=${loc.lat}&lon=${loc.lon}&name=${encodeURIComponent(loc.name)}&altitude=${loc.altitudeM}&region=${encodeURIComponent(loc.state)}`
          : `/api/weather?trekId=${selectedTrekId}`;
        const res = await fetch(url);"""
content = re.sub(weather_fetch_regex2, new_weather_fetch2, content)

region_tabs_regex = r"\{\/\* Region Tabs \*\/\}\s*<div className=\"flex items-center gap-1\.5 bg-white p-1 rounded-xl border border-\[\#E8E4D9\] text-xs\">[\s\S]*?</div>"
new_region_tabs = """{/* Region Tabs */}
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-white border border-[#E8E4D9] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2D3633] focus:outline-none min-w-[140px]">
            {availableStates.map(s => <option key={s} value={s}>{s === 'All' ? '🇮🇳 All India' : s}</option>)}
          </select>"""
content = re.sub(region_tabs_regex, new_region_tabs, content)

# update filteredTreks logic
filtered_treks_regex = r"const filteredTreks = regionFilter === 'All' \n    \? treks \n    : treks\.filter\(\(t\) => t\.region === regionFilter\);"
new_filtered_treks = "const filteredLocations = regionFilter === 'All' ? allLocations : allLocations.filter(l => l.state === regionFilter);"
content = content.replace(filtered_treks_regex, new_filtered_treks)

content = content.replace("filteredTreks.map((t)", "filteredLocations.map((t)")
content = content.replace("const isSelected = t.id === selectedTrekId;", "const isSelected = t.id === selectedTrekId;")

with open('src/components/LiveWeatherModal.tsx', 'w') as f:
    f.write(content)
