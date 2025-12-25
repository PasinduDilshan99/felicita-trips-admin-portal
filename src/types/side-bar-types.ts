export interface SideBarDataType {
  id: number;
  name: string;
  description: string;
  color:string;
  url: string;
  subData: {
    id: number;
    name: string;
    description: string;
    url: string;
  }[];
}