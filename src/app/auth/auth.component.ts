import { Component } from '@angular/core';
import { TaskService } from '../shared/services/task.service';
import { Task } from '../shared/models/task.model';
import { LoginService } from '../shared/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  tasks:Task[];
  filteredTasks :Task[];
  selectedStatus: string = '';
  hasUnsavedChanges:boolean;
  taskForm: FormGroup;
  constructor(private messageService:MessageService,private fb: FormBuilder,private taskService: TaskService,private authService: LoginService, private router : Router){
    this.tasks=[];
    this.filteredTasks = [];
    this.hasUnsavedChanges = false;
    this.taskForm = this.fb.group({
      title: ['', Validators.required]
    });
  }
  ngOnInit() {
    //aqui tratamos de mockear los datos si en dado caso no hemos guardado nada en el local storage, esto con el fin de realizar mejor la prueba
    const localTasks = this.taskService.loadFromLocalStorage();
    if (localTasks.length > 0) {
      this.tasks = localTasks.reverse();
      this.filteredTasks = [...this.tasks];
    } else {
      this.taskService.getTasks().subscribe(data => {
        this.tasks = data.reverse();
        this.filteredTasks = [...this.tasks];
        this.taskService.saveToLocalStorage(this.tasks); 
      });
    }
  }
  filterTasks() {
    if (this.selectedStatus) {
      this.filteredTasks = this.tasks.filter(task => task.status === this.selectedStatus);
    } else {
      this.filteredTasks = [...this.tasks];
    }
  }
  createTask(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: Date.now(), // Usamos el timestamp como ID único
        title: this.taskForm.value.title,
        status: 'pendiente' 
      };
  
      this.tasks.unshift(newTask); 
      this.filteredTasks = [...this.tasks];
      this.taskForm.reset(); 
  
      
      this.hasUnsavedChanges = true;
    }
  }
  
  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
  
  toggleTaskStatus(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.status = task.status === 'pendiente' ? 'completada' : 'pendiente';
    }
    this.taskService.toggleTaskStatusInLocalStorage(id);
    this.messageService.addMessage({severity:"success",summary:"El estado de la tarea ha sido actualizado"});

  }
  
  
  saveToLocalStorage(): void {
    this.taskService.saveToLocalStorage(this.tasks);
    this.hasUnsavedChanges = false;
    this.messageService.addMessage({severity:"success",summary:"Se han guardado las tareas en el local storage exitosamente"});
  }

}
