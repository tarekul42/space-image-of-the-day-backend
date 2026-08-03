import { ICosmicObject } from "./catalog.interface";

/**
 * Canonical cosmic object catalog (backend source of truth).
 * The frontend ships a trimmed offline seed (`frontend/src/data/catalog.ts`);
 * keep the `ICosmicObject` shape identical so both are interchangeable.
 */

const stars: ICosmicObject[] = [
  { id: "sirius", name: "Sirius", aliases: ["Alpha Canis Majoris", "Dog Star"], ra: 101.287, dec: -16.716, objectType: "Star", constellation: "Canis Major", magnitude: -1.47, distanceLy: 8.6 },
  { id: "canopus", name: "Canopus", aliases: ["Alpha Carinae"], ra: 95.988, dec: -52.696, objectType: "Star", constellation: "Carina", magnitude: -0.74, distanceLy: 310 },
  { id: "rigil-kentaurus", name: "Rigil Kentaurus", aliases: ["Alpha Centauri", "Toliman"], ra: 219.902, dec: -60.834, objectType: "Star", constellation: "Centaurus", magnitude: -0.27, distanceLy: 4.37 },
  { id: "arcturus", name: "Arcturus", aliases: ["Alpha Boötis"], ra: 213.915, dec: 19.182, objectType: "Star", constellation: "Boötes", magnitude: -0.05, distanceLy: 36.7 },
  { id: "vega", name: "Vega", aliases: ["Alpha Lyrae"], ra: 279.235, dec: 38.784, objectType: "Star", constellation: "Lyra", magnitude: 0.03, distanceLy: 25 },
  { id: "capella", name: "Capella", aliases: ["Alpha Aurigae"], ra: 79.172, dec: 45.998, objectType: "Star", constellation: "Auriga", magnitude: 0.08, distanceLy: 42.9 },
  { id: "rigel", name: "Rigel", aliases: ["Beta Orionis"], ra: 78.634, dec: -8.202, objectType: "Blue Supergiant", constellation: "Orion", magnitude: 0.13, distanceLy: 860 },
  { id: "procyon", name: "Procyon", aliases: ["Alpha Canis Minoris"], ra: 114.825, dec: 5.225, objectType: "Star", constellation: "Canis Minor", magnitude: 0.34, distanceLy: 11.5 },
  { id: "achernar", name: "Achernar", aliases: ["Alpha Eridani"], ra: 24.429, dec: -57.237, objectType: "Star", constellation: "Eridanus", magnitude: 0.46, distanceLy: 139 },
  { id: "betelgeuse", name: "Betelgeuse", aliases: ["Alpha Orionis"], ra: 88.793, dec: 7.407, objectType: "Red Supergiant", constellation: "Orion", magnitude: 0.5, distanceLy: 640 },
  { id: "hadar", name: "Hadar", aliases: ["Beta Centauri"], ra: 210.956, dec: -60.373, objectType: "Star", constellation: "Centaurus", magnitude: 0.61, distanceLy: 390 },
  { id: "altair", name: "Altair", aliases: ["Alpha Aquilae"], ra: 297.695, dec: 8.868, objectType: "Star", constellation: "Aquila", magnitude: 0.77, distanceLy: 16.7 },
  { id: "aldebaran", name: "Aldebaran", aliases: ["Alpha Tauri"], ra: 68.98, dec: 16.509, objectType: "Red Giant", constellation: "Taurus", magnitude: 0.86, distanceLy: 65 },
  { id: "antares", name: "Antares", aliases: ["Alpha Scorpii"], ra: 247.352, dec: -26.432, objectType: "Red Supergiant", constellation: "Scorpius", magnitude: 0.96, distanceLy: 550 },
  { id: "spica", name: "Spica", aliases: ["Alpha Virginis"], ra: 201.298, dec: -11.161, objectType: "Star", constellation: "Virgo", magnitude: 0.97, distanceLy: 250 },
  { id: "fomalhaut", name: "Fomalhaut", aliases: ["Alpha Piscis Austrini"], ra: 344.413, dec: -29.622, objectType: "Star", constellation: "Piscis Austrinus", magnitude: 1.16, distanceLy: 25 },
  { id: "pollux", name: "Pollux", aliases: ["Beta Geminorum"], ra: 116.329, dec: 28.026, objectType: "Star", constellation: "Gemini", magnitude: 1.15, distanceLy: 34 },
  { id: "deneb", name: "Deneb", aliases: ["Alpha Cygni"], ra: 310.358, dec: 45.28, objectType: "Blue Supergiant", constellation: "Cygnus", magnitude: 1.25, distanceLy: 2600 },
  { id: "regulus", name: "Regulus", aliases: ["Alpha Leonis"], ra: 152.093, dec: 11.967, objectType: "Star", constellation: "Leo", magnitude: 1.35, distanceLy: 79 },
  { id: "castor", name: "Castor", aliases: ["Alpha Geminorum"], ra: 113.65, dec: 31.888, objectType: "Star", constellation: "Gemini", magnitude: 1.58, distanceLy: 51 },
  { id: "shaula", name: "Shaula", aliases: ["Lambda Scorpii"], ra: 263.402, dec: -37.104, objectType: "Star", constellation: "Scorpius", magnitude: 1.62, distanceLy: 570 },
  { id: "polaris", name: "Polaris", aliases: ["North Star", "Alpha Ursae Minoris"], ra: 37.955, dec: 89.264, objectType: "Cepheid Variable", constellation: "Ursa Minor", magnitude: 1.98, distanceLy: 433 },
  { id: "mimosa", name: "Mimosa", aliases: ["Beta Crucis"], ra: 186.65, dec: -59.689, objectType: "Star", constellation: "Crux", magnitude: 1.25, distanceLy: 280 },
  { id: "gacrux", name: "Gacrux", aliases: ["Gamma Crucis"], ra: 187.791, dec: -57.113, objectType: "Red Giant", constellation: "Crux", magnitude: 1.64, distanceLy: 88.6 },
  { id: "algol", name: "Algol", aliases: ["Beta Persei"], ra: 47.042, dec: 40.956, objectType: "Eclipsing Binary", constellation: "Perseus", magnitude: 2.12, distanceLy: 90 },
  { id: "markab", name: "Markab", aliases: ["Alpha Pegasi"], ra: 345.944, dec: 15.205, objectType: "Star", constellation: "Pegasus", magnitude: 2.49, distanceLy: 140 },
];

const deepSky: ICosmicObject[] = [
  { id: "m31", name: "Andromeda Galaxy", aliases: ["M31", "Messier 31", "NGC 224"], ra: 10.684, dec: 41.269, objectType: "Galaxy", constellation: "Andromeda", magnitude: 3.44, distanceLy: 2500000, description: "The nearest major galaxy to our own, visible to the naked eye on dark nights." },
  { id: "m42", name: "Orion Nebula", aliases: ["M42", "Messier 42", "NGC 1976"], ra: 83.822, dec: -5.391, objectType: "HII Region", constellation: "Orion", magnitude: 4.0, distanceLy: 1344, description: "A vast stellar nursery glowing in the sword of Orion." },
  { id: "m45", name: "Pleiades", aliases: ["M45", "Seven Sisters", "Messier 45"], ra: 56.75, dec: 24.117, objectType: "Open Cluster", constellation: "Taurus", magnitude: 1.6, distanceLy: 444, description: "A brilliant young open cluster of hot blue stars." },
  { id: "m13", name: "Hercules Cluster", aliases: ["M13", "Messier 13", "NGC 6205"], ra: 250.423, dec: 36.461, objectType: "Globular Cluster", constellation: "Hercules", magnitude: 5.8, distanceLy: 22000, description: "The finest globular cluster in the northern sky." },
  { id: "m51", name: "Whirlpool Galaxy", aliases: ["M51", "Messier 51", "NGC 5194"], ra: 202.47, dec: 47.195, objectType: "Galaxy", constellation: "Canes Venatici", magnitude: 8.4, distanceLy: 23000000, description: "A grand-design spiral galaxy interacting with a smaller companion." },
  { id: "m57", name: "Ring Nebula", aliases: ["M57", "Messier 57", "NGC 6720"], ra: 283.396, dec: 33.029, objectType: "Planetary Nebula", constellation: "Lyra", magnitude: 8.8, distanceLy: 2300, description: "A dying star's glowing shell, a ring of expelled gas." },
  { id: "m104", name: "Sombrero Galaxy", aliases: ["M104", "Messier 104", "NGC 4594"], ra: 189.998, dec: -11.623, objectType: "Galaxy", constellation: "Virgo", magnitude: 8.0, distanceLy: 29000000, description: "An unbarred spiral galaxy seen nearly edge-on with a striking dust lane." },
  { id: "m1-crab", name: "Crab Nebula", aliases: ["M1", "Messier 1", "NGC 1952"], ra: 83.633, dec: 22.014, objectType: "Supernova Remnant", constellation: "Taurus", magnitude: 8.4, distanceLy: 6500, description: "The expanding wreckage of a supernova witnessed in 1054 AD." },
  { id: "ngc7000", name: "North America Nebula", aliases: ["NGC 7000"], ra: 314.5, dec: 44.5, objectType: "HII Region", constellation: "Cygnus", magnitude: 6.0, distanceLy: 1800, description: "An emission nebula shaped like the continent that inspired its name." },
  { id: "double-cluster", name: "Double Cluster", aliases: ["NGC 869", "NGC 884", "h and chi Perseii"], ra: 35.27, dec: 57.13, objectType: "Open Cluster", constellation: "Perseus", magnitude: 4.3, distanceLy: 7500, description: "Two rich open clusters of young blue stars side by side." },
  { id: "omega-centauri", name: "Omega Centauri", aliases: ["NGC 5139"], ra: 201.697, dec: -47.48, objectType: "Globular Cluster", constellation: "Centaurus", magnitude: 3.9, distanceLy: 18000, description: "The largest globular cluster in the Milky Way." },
  { id: "m81", name: "Bode's Galaxy", aliases: ["M81", "Messier 81", "NGC 3031"], ra: 148.888, dec: 69.065, objectType: "Galaxy", constellation: "Ursa Major", magnitude: 6.9, distanceLy: 12000000, description: "A grand spiral galaxy paired with the nearby Cigar Galaxy." },
  { id: "m82", name: "Cigar Galaxy", aliases: ["M82", "Messier 82", "NGC 3034"], ra: 148.97, dec: 69.68, objectType: "Starburst Galaxy", constellation: "Ursa Major", magnitude: 8.4, distanceLy: 12000000, description: "A starburst galaxy undergoing intense star formation." },
  { id: "m44", name: "Beehive Cluster", aliases: ["M44", "Messier 44", "Praesepe", "NGC 2632"], ra: 130.1, dec: 19.67, objectType: "Open Cluster", constellation: "Cancer", magnitude: 3.7, distanceLy: 577, description: "An ancient open cluster near the heart of Cancer." },
  { id: "m33", name: "Triangulum Galaxy", aliases: ["M33", "Messier 33", "NGC 598"], ra: 23.462, dec: 30.66, objectType: "Galaxy", constellation: "Triangulum", magnitude: 5.7, distanceLy: 2730000, description: "The third-largest member of the Local Group of galaxies." },
  { id: "m104v", name: "Eta Carinae Nebula", aliases: ["Carina Nebula", "NGC 3372"], ra: 161.266, dec: -59.69, objectType: "HII Region", constellation: "Carina", magnitude: 1.0, distanceLy: 7500, description: "One of the largest and brightest nebulae in the night sky." },
  { id: "m2c", name: "Lagoon Nebula", aliases: ["M8", "Messier 8", "NGC 6523"], ra: 270.964, dec: -24.38, objectType: "HII Region", constellation: "Sagittarius", magnitude: 6.0, distanceLy: 4100, description: "A giant interstellar cloud hosting a star-forming region." },
  { id: "m16", name: "Eagle Nebula", aliases: ["M16", "Messier 16", "Pillars of Creation", "NGC 6611"], ra: 274.7, dec: -13.81, objectType: "HII Region", constellation: "Serpens", magnitude: 6.0, distanceLy: 7000, description: "Home of the famous Pillars of Creation imaged by Hubble." },
  { id: "m20", name: "Trifid Nebula", aliases: ["M20", "Messier 20", "NGC 6514"], ra: 270.652, dec: -23.02, objectType: "HII Region", constellation: "Sagittarius", magnitude: 6.3, distanceLy: 5200, description: "A colorful combination of emission and reflection nebula." },
  { id: "m78", name: "M78", aliases: ["Messier 78", "NGC 2068"], ra: 86.667, dec: 0.02, objectType: "Reflection Nebula", constellation: "Orion", magnitude: 8.3, distanceLy: 1600, description: "A bright reflection nebula in the belt region of Orion." },
];

const planets: ICosmicObject[] = [
  { id: "mercury", name: "Mercury", ra: 120, dec: 15, objectType: "Planet", constellation: "", magnitude: -0.4, description: "The innermost planet — position computed live on the map." },
  { id: "venus", name: "Venus", ra: 175, dec: 0, objectType: "Planet", constellation: "", magnitude: -4.2, description: "The morning and evening star — position computed live on the map." },
  { id: "mars", name: "Mars", ra: 84, dec: 23, objectType: "Planet", constellation: "", magnitude: 0.3, description: "The Red Planet — position computed live on the map." },
  { id: "jupiter", name: "Jupiter", ra: 129, dec: 19, objectType: "Planet", constellation: "", magnitude: -2.4, description: "The giant of the solar system — position computed live on the map." },
  { id: "saturn", name: "Saturn", ra: 14, dec: 3, objectType: "Planet", constellation: "", magnitude: 0.8, description: "The ringed planet — position computed live on the map." },
  { id: "uranus", name: "Uranus", ra: 63, dec: 21, objectType: "Planet", constellation: "", magnitude: 5.7, description: "An ice giant — position computed live on the map." },
  { id: "neptune", name: "Neptune", ra: 4, dec: 0, objectType: "Planet", constellation: "", magnitude: 7.7, description: "The outermost planet — position computed live on the map." },
];

export const COSMIC_CATALOG: ICosmicObject[] = [...stars, ...deepSky, ...planets];
