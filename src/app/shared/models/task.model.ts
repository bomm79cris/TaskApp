export interface Task{
    id:number,
    title:string,
    status: 'pendiente' | 'completada';
}