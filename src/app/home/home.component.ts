import { Component, OnInit } from '@angular/core';
import { AuthService, ProjectSearchRequest } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  searchText?: string;
  title = 'Project Management Page';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  isNewRowVisible: boolean = false;
  newProject = {
    name: '',
    description: ''
  };
  constructor(private authService:AuthService) { }
  projectList: any[] = [];
  async ngOnInit() { 
    this.loadProjects(); 
  }
  async loadProjects() {
    const payload: ProjectSearchRequest = {
      projectName: "",  // Use searchText for filtering
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: '',
      sortDirection: 'ASC',
      query: this.searchText || '',  // Pass the search text as the query
    };
    try {
      const result = await this.authService.searchProjects(payload);
      this.projectList = result.data.content;  // Update the project list with the filtered data
      this.currentPage = result.data.page-1;
      this.pageSize = result.data.pageSize;
      this.totalPages = result.data.totalPages;
      this.totalElements =result.data.totalElements;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  searchProjects() {
    this.currentPage = 0; // Reset to the first page when searching
    this.loadProjects();
  }

   // Navigate to the next page
   nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProjects();  // Fetch data for the next page
    }
  }

  // Navigate to the previous page
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProjects();  // Fetch data for the previous page
    }
  }

  // Navigate to a specific page
  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProjects();  // Fetch data for the specified page
    }
  }
  get pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

      // Hiển thị dòng mới để tạo task
      addTaskRow() {
        this.isNewRowVisible = true; // Hiển thị dòng mới
      }
  
        // Lưu task mới vào danh sách
    async savenewProject() {
      if (this.validateTask(this.newProject)) {
        console.log(this.newProject);
        try {
          const response = await this.authService.registerProject(this.newProject);  // Gửi API tạo task mới
          this.projectList.push(response.data);  // Thêm task vào danh sách
          this.resetNewTaskForm(); // Reset form tạo task mới
          this.isNewRowVisible = false; // Ẩn dòng tạo mới
          alert('Task created successfully!');
          this.loadProjects();
        } catch (error) {
          console.error('Error saving new task', error);
          alert('Error saving new task');
        }
      } else {
        alert('Please fill in all required fields');
      }
    }
  
    // Xác nhận thông tin task hợp lệ
    validateTask(project: any): boolean {
      return project.name;
    }
  
    // Hủy tạo task mới (ẩn dòng mới)
    cancelnewProject() {
      this.resetNewTaskForm();
      this.isNewRowVisible = false;
    }
  
    // Reset form task mới
    resetNewTaskForm() {
      this.newProject = {
        name: '',
        description: ''
      };
    }

    onPageChange(page:number){
      this.currentPage = page;
      this.loadProjects();
    }

    handleSearch(value: string): void {
      this.searchText = value;
      this.loadProjects();
    }
}
