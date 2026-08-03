export interface ICosmicObject {
  id: string;
  name: string;
  aliases?: string[];
  ra: number; // degrees (J2000)
  dec: number; // degrees (J2000)
  objectType: string;
  constellation: string;
  magnitude?: number;
  distanceLy?: number;
  description?: string;
}
