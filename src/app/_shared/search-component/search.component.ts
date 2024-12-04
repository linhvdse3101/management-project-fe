import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class searchComponent implements OnInit {
   /**
   * Placeholder cho ô tìm kiếm, có thể tuỳ chỉnh từ bên ngoài.
   */
   @Input() placeholder: string = '';

   /**
    * Giá trị của text nhập vào, dùng để two-way binding với các component khác.
    */
   @Input() searchText?: string = '';
 
   /**
    * EventEmitter để truyền giá trị tìm kiếm ra ngoài khi nhấn Enter.
    */
   @Output() searchSubmit: EventEmitter<string> = new EventEmitter<string>();
 
   /**
    * Xử lý khi nhấn phím, nếu là phím Enter thì emit sự kiện.
    */

   ngOnInit(): void {
  }

   onKeyPress(event: KeyboardEvent): void {
     if (event.key === 'Enter') {
       this.searchSubmit.emit(this.searchText);
     }
   }
  
}