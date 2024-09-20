export interface Location {
    nearby?: string;
    road_name?: string;
    village_town?: string;
    village_name_town_name?: string;
    area_name?: string;
    district_name?: string;
    state_name?: string;
    landslide_type?: string;
    casualty_description?: string;
    landslide_size?: string;
    triggering_factor?: string;
    infrastructural_damage?: string;
    date?: string; // Date is stored as a string
    time?: string;
    pincode?: number;
    lat: number;
    lon: number;
    address?: string;
  }
  
  export interface LandslideRecord {
    landslide_report?: string;
    source_name?: string;
    locations: Location[]; // Array of Location objects
  }
  
  export interface Record {
    id: string; // Matches @id in Prisma, String is used for ObjectId
    title: string;
    link: string;
    published: string;
    summary: string;
    contents: string;
    landslide_record?: LandslideRecord; // Optional LandslideRecord
  }