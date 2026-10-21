export type CourseMaterial={id:string;name:string;url:string;fileName:string;duration:number;sizeLabel:string};
export const lessonMaterials:Record<number,CourseMaterial[]>={
  5:[
    {id:'aula-5-apoio-01',name:'Vídeo de apoio 01',url:'/materials/aula-5/video-apoio-01.mp4',fileName:'aula-5-video-de-apoio-01.mp4',duration:41.766667,sizeLabel:'2,7 MB'},
    {id:'aula-5-apoio-02',name:'Vídeo de apoio 02',url:'/materials/aula-5/video-apoio-02.mp4',fileName:'aula-5-video-de-apoio-02.mp4',duration:19.633333,sizeLabel:'1,2 MB'}
  ]
};
