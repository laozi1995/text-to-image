export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  style: {
    container: string;
    text: string;
  };
} 