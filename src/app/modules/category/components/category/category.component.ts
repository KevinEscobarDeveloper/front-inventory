import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        console.log('repuesta categories: ', data);
        this.processCategoriesResponse(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];
    if (resp.metadata[0].code == '00') {
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar("Categoria Agregada","Exitosa");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar categoría","Error");
      }
    });
  }

  edit(id:number, name: string, description: string){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: {id: id, name: name, description: description},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar("Categoria Actualizada","Exitosa");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar categoría","Error");
      }
    });
  }

  delete (id: any){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {id: id},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openSnackBar("Categoria Eliminada","Exitosa");
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar categoría","Error");
      }
    });
  }

  openSnackBar(
    mesagge: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(mesagge, action, {
      duration: 2000,
    });
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
