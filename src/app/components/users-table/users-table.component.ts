import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface UserInfo {
  userId: number;
  username: string;
  email: string;
}[]

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnChanges {

  @Input() users!: UserInfo[];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['users'] || !Array.isArray(changes['users'].currentValue)) return;
    this.dataSource.data = changes['users'].currentValue as UserInfo[];
  }

  public dataSource = new MatTableDataSource<UserInfo>(this.users);

  displayedColumns: string[] = ['username', 'email'];
}
