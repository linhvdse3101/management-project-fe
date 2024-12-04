import { Component, OnInit } from '@angular/core';
import { AuthService, IUserCreate, ProjectSearchRequest, TaskSearchRequest } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-project-detail',
  templateUrl: './projectDetail.component.html',
  styleUrls: ['./projectDetail.component.css']
})
export class projectDetailComponent implements OnInit {

  searchText?: string;
  title = 'Project Detail Page';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  projectId?: number; 
  taskList: any[] = [];
  project: any;
  userList: any[] = [];
  statusList: any[] = ["NOT_STARTED", "IN_PROGRESS" , "COMPLETED", "ON_HOLD", "CANCELLED"];
  assignTo: any;
  status: any;
  isNewRowVisible: boolean = false; // Điều kiện hiển thị dòng task mới
  newTask = {
    taskName: '',
    projectId: this.projectId,
    description: '',
    status: '',
    userName: ''
  };

  constructor(private authService:AuthService,private routerActive:ActivatedRoute,private router: Router) { }

  async ngOnInit() { 
    
    this.projectId = Number(this.routerActive.snapshot.paramMap.get('id'));
    this.newTask.projectId = this.projectId
    if (this.projectId) {
      await this.loadProject(); // Gọi API với projectId
    } else {
      console.error('Project ID not found in URL.');
    }
  }

  async loadProject() {
    if (!this.projectId) return;

    const payload: TaskSearchRequest = {
      taskName: "",  // Use searchText for filtering
      projectId: this.projectId,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: '',
      sortDirection: 'ASC',
      query: this.searchText || '',  // Pass the search text as the query
    };
    try {
      const project = await this.authService.getProjectDetail(this.projectId);
      const taskList = await this.authService.searchTasks(payload);
      const users = await this.authService.getUserTask();
      this.userList = users.data;
      this.project = project.data;
      this.taskList = taskList.data.content;
      this.totalPages = taskList.data.totalPages;
      this.totalElements = taskList.data.totalElements;

    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }

  ontaskStatusChange(status: any){
    this.status = status;
  }

  onAssignedToChange(user: any) {
    // Gửi API để cập nhật assignedTo khi có thay đổi
    this.assignTo = user;
  }


  searchProjects() {
    this.currentPage = 0; // Reset to the first page when searching
    this.loadProject();
  }

   // Navigate to the next page
   nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProject();  // Fetch data for the next page
    }
  }

  // Navigate to the previous page
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProject();  // Fetch data for the previous page
    }
  }

  // Navigate to a specific page
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProject();  // Fetch data for the specified page
    }
  }
  get pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  

  async editTask(task: any) {
    try {
      const payload = {
        taskId: task.taskId,
        taskName: task.taskName,
        projectId: this.projectId,
        userAssign: task.assignedTo,
        description: task.taskDescription,
        status: task.taskStatus
      };
      
      await this.authService.updateTasks(task.taskId,payload);
      alert('Task updated successfully!');
      
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    }
  }
  
  async deleteTask(taskId: number) {
    try {
      await this.authService.deleteTasks(taskId);
      alert('Task deleted successfully!');
      // Refresh the task list after deletion
      this.loadProject();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  }

    // Hiển thị dòng mới để tạo task
    addTaskRow() {
      this.isNewRowVisible = true; // Hiển thị dòng mới
    }

      // Lưu task mới vào danh sách
  async saveNewTask() {
    if (this.validateTask(this.newTask)) {
      console.log(this.newTask);
      try {
        const response = await this.authService.registerTasks(this.newTask);  // Gửi API tạo task mới
        this.taskList.push(response.data);  // Thêm task vào danh sách
        this.resetNewTaskForm(); // Reset form tạo task mới
        this.isNewRowVisible = false; // Ẩn dòng tạo mới
        alert('Task created successfully!');
        this.loadProject();
      } catch (error) {
        console.error('Error saving new task', error);
        alert('Error saving new task');
      }
    } else {
      alert('Please fill in all required fields');
    }
  }

  // Xác nhận thông tin task hợp lệ
  validateTask(task: any): boolean {
    return task.taskName && task.status && task.userName;
  }

  // Hủy tạo task mới (ẩn dòng mới)
  cancelNewTask() {
    this.resetNewTaskForm();
    this.isNewRowVisible = false;
  }

  // Reset form task mới
  resetNewTaskForm() {
    this.newTask = {
      taskName: '',
      projectId: this.projectId,
      description: '',
      status: '',
      userName: ''
    };
  }
  handleSearch(value: string): void {
    this.searchText = value;
    this.loadProject();
  }

  goBack(){
    this.router.navigate(['/project']);
  }
}

