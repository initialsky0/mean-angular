import { NgModule } from "@angular/core";

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

// does not need imports if the exports is the same
@NgModule({
   exports: [
      MatInputModule, 
      MatCardModule, 
      MatButtonModule, 
      MatToolbarModule, 
      MatExpansionModule, 
      MatProgressSpinnerModule, 
      MatPaginatorModule, 
      MatDialogModule
   ]
})
export class AngularMaterialModule {}