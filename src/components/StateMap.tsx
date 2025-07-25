import {useEffect,useState} from 'react';
import{ComposableMap,Geographies,Geography, ZoomableGroup} from "react-simple-maps";
import {feature} from "topojson-client";
import {geoCentroid, geoBounds} from "d3-geo";
import Member from './member';
import "./StateMap.css"

const geoUrl ="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"


const StateMap = ({state,onBack,members}:{state:string; onBack:()=>void; members:{name:string; imageURL:string; Party:string; [key:string]: any}[];}) => {
    const [features,setFeatures]=useState<any[]>([])
    const [center,setCenter]= useState<[number,number]>([-98,38]);
    const [markers,setMarkers]= useState<any[]>([]);
    const [setSelectedMember] = useState<any | null>(null); 


    useEffect(()=>{
        fetch(geoUrl).then((res)=>res.json()).then((topo)=>{
            const geo = feature(topo, topo.objects.states) as any;
            const filtered = geo.features.filter((f: any) => f.id === state);
            

            if (filtered.length > 0) {
            const centroid = geoCentroid(filtered[0]);
            setCenter(centroid);
            if (Array.isArray(members)) {
                const angleStep = (2 * Math.PI) / members.length;
                const bounds= geoBounds(filtered[0]);
                const width=Math.abs(bounds[1][0]-bounds[0][0]);
                const height= Math.abs(bounds[1][1]- bounds[0][1]);
                const radius=20* Math.min(width,height);
                const generated = members.map((member, i) => {
                const angle = i * angleStep;
                const dx = radius * Math.cos(angle);
                const dy = radius * Math.sin(angle);

                return {
                    ...member,
                    coordinates: [centroid[0] + dx, centroid[1] + dy],
                };
                });
            setMarkers(generated);
            }
            setFeatures(filtered);
        }
        });
    }, [state, members]);
  return (
    <div>
        <button onClick={onBack} style={{ position:"absolute",top:20,left:20,zIndex:10}}>Back to the US map</button> 
        <ComposableMap projection={"geoAlbersUsa"} projectionConfig={{scale:2000}} style={{width:"97vw",height:"96vh"}}>
            <ZoomableGroup center={center} zoom={1} key={center.toString()}>
                <Geographies geography={{type:"FeatureCollection",features}}>
                    {({geographies}) =>
                        geographies.map((geo: any) => (
                            <Geography key={geo.id} geography={geo} tabIndex={-1} style={{
                                default: { fill: "#30ceb4ff", stroke: "#000" },
                                hover: { fill: "#30ceb4ff" , stroke: "#000"},
                                pressed:{fill: "#30ceb4ff" , stroke: "#000",outline:"none"}
                            }} />
                        ))
                    }
                </Geographies>
                {markers.map((member, idx) => (
                <Member
                    key={idx}
                    x={member.coordinates[0]}
                    y={member.coordinates[1]}
                    member={member}
                    onClick={() => setSelectedMember(member)}
                />
                ))}
            </ZoomableGroup>
        </ComposableMap>

    </div>
  );
};

export default StateMap;