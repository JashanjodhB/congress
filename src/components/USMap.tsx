import "./USMap.css";
import {ComposableMap,Geographies,Geography,Marker,ZoomableGroup} from 'react-simple-maps'
import {useMemo, useState} from "react";
import { geoCentroid, geoPath } from "d3-geo";
import StateMap from "./StateMap";

const geoUrl="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"


type MemberData = {
  Name: string;
  Party: string;
  imageURL:string
  [key: string]: any;
};

type StateChamberData = {
  House?: MemberData[];
  Senate?: MemberData[];
};

type GroupedMembers = {
  [stateName: string]: StateChamberData;
};


import groupedMembersRaw from "./groupedMembers.json";
const groupedMembers = groupedMembersRaw as GroupedMembers;


const colors: { [fips: string]: { name: string; color: string } } = {
  "01": { name: "Alabama", color: "#c584f1ff" },
  "02": { name: "Alaska", color: "#2e72d8ff" },
  "04": { name: "Arizona", color: "#e4e129ff" },
  "05": { name: "Arkansas", color: "#2e72d8ff" },
  "06": { name: "California", color: "#84f1d9ff" },
  "08": { name: "Colorado", color: "#2e72d8ff" },
  "09": { name: "Connecticut", color: "#c584f1ff" },
  "10": { name: "Delaware", color: "#a330a3ff" },
  "11": { name: "District of Columbia", color: "#f54a9aff" },
  "12": { name: "Florida", color: "#ee4141ff" },
  "13": { name: "Georgia", color: "#f54a9aff" },
  "15": { name: "Hawaii", color: "#e48436ff" },
  "16": { name: "Idaho", color: "#e4e129ff" },
  "17": { name: "Illinois", color: "#7aff3dff" },
  "18": { name: "Indiana", color: "#84f1d9ff" },
  "19": { name: "Iowa", color: "#2e72d8ff" },
  "20": { name: "Kansas", color: "#c584f1ff" },
  "21": { name: "Kentucky", color: "#a330a3ff" },
  "22": { name: "Louisiana", color: "#f54a9aff" },
  "23": { name: "Maine", color: "#ee4141ff" },
  "24": { name: "Maryland", color: "#db3737ff" },
  "25": { name: "Massachusetts", color: "#e48436ff" },
  "26": { name: "Michigan", color: "#e4e129ff" },
  "27": { name: "Minnesota", color: "#7aff3dff" },
  "28": { name: "Mississippi", color: "#84f1d9ff" },
  "29": { name: "Missouri", color: "#db3737ff" },
  "30": { name: "Montana", color: "#c584f1ff" },
  "31": { name: "Nebraska", color: "#a330a3ff" },
  "32": { name: "Nevada", color: "#f54a9aff" },
  "33": { name: "New Hampshire", color: "#ee4141ff" },
  "34": { name: "New Jersey", color: "#db3737ff" },
  "35": { name: "New Mexico", color: "#e48436ff" },
  "36": { name: "New York", color: "#e4e129ff" },
  "37": { name: "North Carolina", color: "#7aff3dff" },
  "38": { name: "North Dakota", color: "#84f1d9ff" },
  "39": { name: "Ohio", color: "#2e72d8ff" },
  "40": { name: "Oklahoma", color: "#c584f1ff" },
  "41": { name: "Oregon", color: "#c584f1ff" },
  "42": { name: "Pennsylvania", color: "#f54a9aff" },
  "44": { name: "Rhode Island", color: "#ee4141ff" },
  "45": { name: "South Carolina", color: "#db3737ff" },
  "46": { name: "South Dakota", color: "#e48436ff" },
  "47": { name: "Tennessee", color: "#e4e129ff" },
  "48": { name: "Texas", color: "#7aff3dff" },
  "49": { name: "Utah", color: "#84f1d9ff" },
  "50": { name: "Vermont", color: "#2e72d8ff" },
  "51": { name: "Virginia", color: "#c584f1ff" },
  "53": { name: "Washington", color: "#a330a3ff" },
  "54": { name: "West Virginia", color: "#f54a9aff" },
  "55": { name: "Wisconsin", color: "#ee4141ff" },
  "56": { name: "Wyoming", color: "#db3737ff" }
};

const fipsToState = Object.entries(colors).reduce((acc, [fips, { name }]) => {
    acc[fips] = name;
    return acc;
}, {} as Record<string, string>);


const USMap=()=>{
  const [selectedState, setSelectedState]=useState<string | null>(null);
  const colorMap=useMemo(()=>{
    const map:{[key:string]:string}={};
    for (const c in colors) {
      map[c] = colors[c].color;
    }

    return map;
  }, []);


if (selectedState) {
  const stateName = fipsToState[selectedState];
  const members =
  groupedMembers[stateName]?.House?.concat(groupedMembers[stateName]?.Senate || []) || [];

  const mappedMembers = members.map((m) => ({
    ...m,
    name: m.Name,
  }));


  return (
    <StateMap
      state={selectedState}
      onBack={() => setSelectedState(null)}
      members={mappedMembers}
    />
  );
}





  return (
    <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1100 }} style={{ width: '97vw', height: '96vh' }}>
      <ZoomableGroup>
        <Geographies geography={geoUrl}>
          {({geographies}) =>
            geographies.map((geo) => {
              const stateId = geo.id;
              const fillColor = colorMap[stateId] || "#EEE"; 
              const centroid=geoCentroid(geo);
              const label=colors[stateId]?.name || "";
              return (
                  <g key={geo.rsmKey}>
                <Geography
                  geography={geo}
                  onClick={()=>setSelectedState(stateId)}
                  style={{
                    default: {
                      fill: fillColor,
                      stroke: "#FFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#CCC",
                      outline: "none",
                    },
                  }}
                />
                {label && centroid[0] && centroid[1] && (
                    <Marker coordinates={centroid}>
                      <text
                        textAnchor="middle"
                        fontSize={10}
                        fill="#000"
                        style={{ pointerEvents: "none" }}
                      >
                        {label}
                      </text>
                    </Marker>
                  )}
                </g>
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default USMap;