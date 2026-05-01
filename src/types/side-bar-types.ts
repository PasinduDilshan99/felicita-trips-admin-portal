export interface SideBarDataType {
  id: number;
  name: string;
  description: string;
  color: string;
  url: string;
  privilege: string;
  subData: {
    id: number;
    name: string;
    description: string;
    url: string;
    color?: string;
    privilege: string;
    grandSubData?: {
      id: number;
      name: string;
      description: string;
      url: string;
      color?: string;
      privilege: string;
    }[];
  }[];
}
