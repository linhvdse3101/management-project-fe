import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class pagingComponent implements OnInit {
  @Input() currentPage:number = 1;
  @Input() totalPages: number = 1;          // Input total pages
  @Output() pageChange: EventEmitter<number> = new EventEmitter();  // Output event for page changes
   
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  constructor() { }
  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.pageChange.emit(page);
  }
  
}