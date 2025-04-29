import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient){}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`https://dummyjson.com/c/91fd-f421-45aa-ab5f`);
  }

  addTask(task: Task): Observable<number> {
    //aqui simulamos el envio de una peticiòn post a la api para agregar una nueva tarea 
    return this.http.post<number>(`https://dummyjson.com/c/91fd-f421-45aa-ab5f`, task);
  }

  toggleTaskStatusInLocalStorage(id: number): void {
    const tasks = this.loadFromLocalStorage(); 

    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = task.status === 'pendiente' ? 'completada' : 'pendiente';
      this.saveToLocalStorage(tasks); 
    }
  }

  saveToLocalStorage(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  loadFromLocalStorage(): Task[] {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  }
}
